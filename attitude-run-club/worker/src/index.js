/**
 * Attitude Run Club — API Worker
 *
 * POST /publish  — admin publishes catalog.json (password + catalog)
 * POST /submit   — public: contact message or shop order → inbox
 * POST /inbox    — admin lists / updates inbox (password)
 *
 * Inbox stored as raw JSON on Cloudinary: {folder}/inbox.json
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

async function sha1Hex(message) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function folderOf(env) {
  return env.CLOUDINARY_FOLDER || 'attitude-run-club';
}

function inboxPublicId(env) {
  return `${folderOf(env)}/inbox`;
}

function inboxPublicUrl(env, version) {
  const cloud = env.CLOUDINARY_CLOUD_NAME;
  const id = inboxPublicId(env);
  const v = version ? `v${version}/` : '';
  // try both with and without .json (Cloudinary public_id has no extension)
  return [
    `https://res.cloudinary.com/${cloud}/raw/upload/${v}${id}`,
    `https://res.cloudinary.com/${cloud}/raw/upload/${v}${id}.json`,
  ];
}

async function parseInboxResponse(res) {
  if (!res || !res.ok) return null;
  const text = await res.text();
  if (!text || !text.trim()) return null;
  try {
    const data = JSON.parse(text);
    if (!data || !Array.isArray(data.items)) return null;
    return data;
  } catch {
    return null;
  }
}

/** Read inbox via public CDN, then Admin API if needed */
async function fetchInbox(env) {
  const cloud = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  const publicId = inboxPublicId(env);
  const bust = '?t=' + Date.now();

  // 1) Public CDN URLs
  for (const base of inboxPublicUrl(env)) {
    try {
      const res = await fetch(base + bust, {
        headers: { Accept: 'application/json,text/plain,*/*' },
        cf: { cacheTtl: 0, cacheEverything: false },
      });
      const data = await parseInboxResponse(res);
      if (data) return data;
    } catch (_) {
      /* try next */
    }
  }

  // 2) Admin API → secure_url (works even if CDN path is odd)
  if (cloud && apiKey && apiSecret) {
    try {
      const auth = btoa(`${apiKey}:${apiSecret}`);
      const metaUrl =
        `https://api.cloudinary.com/v1_1/${cloud}/resources/raw/upload/` +
        encodeURIComponent(publicId);
      const metaRes = await fetch(metaUrl, {
        headers: { Authorization: 'Basic ' + auth },
      });
      if (metaRes.ok) {
        const meta = await metaRes.json().catch(() => null);
        const secure = meta?.secure_url || meta?.url;
        if (secure) {
          const res = await fetch(secure + (secure.includes('?') ? '&' : '?') + 't=' + Date.now(), {
            cf: { cacheTtl: 0, cacheEverything: false },
          });
          const data = await parseInboxResponse(res);
          if (data) return data;
        }
      }
      // also try public_id with .json
      const metaUrlJson =
        `https://api.cloudinary.com/v1_1/${cloud}/resources/raw/upload/` +
        encodeURIComponent(publicId + '.json');
      const metaRes2 = await fetch(metaUrlJson, {
        headers: { Authorization: 'Basic ' + auth },
      });
      if (metaRes2.ok) {
        const meta = await metaRes2.json().catch(() => null);
        const secure = meta?.secure_url || meta?.url;
        if (secure) {
          const res = await fetch(secure + (secure.includes('?') ? '&' : '?') + 't=' + Date.now(), {
            cf: { cacheTtl: 0, cacheEverything: false },
          });
          const data = await parseInboxResponse(res);
          if (data) return data;
        }
      }
    } catch (_) {
      /* fall through */
    }
  }

  return { updatedAt: null, items: [] };
}

async function uploadRawJson(env, publicId, payload) {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Server misconfigured: Cloudinary secrets missing');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  // All params except file/api_key/resource_type must be signed (alphabetical)
  const paramsToSign =
    `invalidate=true&overwrite=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1Hex(paramsToSign);

  const form = new FormData();
  form.append(
    'file',
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    'inbox.json'
  );
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('public_id', publicId);
  form.append('overwrite', 'true');
  form.append('invalidate', 'true');
  form.append('signature', signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
  const cloudRes = await fetch(uploadUrl, { method: 'POST', body: form });
  const cloudJson = await cloudRes.json().catch(() => ({}));
  if (!cloudRes.ok) {
    throw new Error(cloudJson.error?.message || cloudJson.message || 'Cloudinary upload failed');
  }
  return cloudJson;
}

function uid(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function sanitizeStr(v, max = 500) {
  return String(v ?? '').trim().slice(0, max);
}

async function handlePublish(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const password = body?.password;
  const catalog = body?.catalog;

  if (!password || typeof password !== 'string') {
    return json({ ok: false, error: 'Missing password' }, 401);
  }
  if (password !== env.ADMIN_PASSWORD) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }
  if (!catalog || typeof catalog !== 'object') {
    return json({ ok: false, error: 'Missing catalog object' }, 400);
  }

  const payload = {
    updatedAt: catalog.updatedAt || new Date().toISOString(),
    products: Array.isArray(catalog.products) ? catalog.products : [],
    zones: Array.isArray(catalog.zones) ? catalog.zones : [],
    texts: catalog.texts && typeof catalog.texts === 'object' ? catalog.texts : { pt: {}, en: {} },
    images: catalog.images && typeof catalog.images === 'object' ? catalog.images : {},
  };

  const publicId = `${folderOf(env)}/catalog`;
  try {
    const cloudJson = await uploadRawJson(env, publicId, payload);
    return json({
      ok: true,
      updatedAt: payload.updatedAt,
      url: cloudJson.secure_url || cloudJson.url || null,
      public_id: cloudJson.public_id || publicId,
      products: payload.products.length,
      zones: payload.zones.length,
    });
  } catch (err) {
    return json({ ok: false, error: err.message || String(err) }, 502);
  }
}

async function handleSubmit(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const type = body?.type === 'order' ? 'order' : 'contact';
  const name = sanitizeStr(body?.name, 120);
  const email = sanitizeStr(body?.email, 120);
  const phone = sanitizeStr(body?.phone, 40);
  const message = sanitizeStr(body?.message, 2000);
  const city = sanitizeStr(body?.city, 120);
  const notes = sanitizeStr(body?.notes, 1000);
  const source = sanitizeStr(body?.source, 40) || (type === 'order' ? 'checkout' : 'contacto');

  if (!name) {
    return json({ ok: false, error: 'Nome é obrigatório' }, 400);
  }
  if (type === 'contact' && !email && !phone && !message) {
    return json({ ok: false, error: 'Preenche email, telefone ou mensagem' }, 400);
  }
  if (type === 'order' && !phone) {
    return json({ ok: false, error: 'Telefone é obrigatório para pedidos' }, 400);
  }

  let items = [];
  let total = 0;
  if (type === 'order' && Array.isArray(body?.items)) {
    items = body.items.slice(0, 40).map((it) => ({
      id: sanitizeStr(it?.id, 60),
      name: sanitizeStr(it?.name, 120),
      size: sanitizeStr(it?.size, 20),
      qty: Math.min(99, Math.max(1, Number(it?.qty) || 1)),
      price: Math.max(0, Number(it?.price) || 0),
    }));
    total = items.reduce((s, it) => s + it.price * it.qty, 0);
    if (body?.total != null && Number(body.total) >= 0) total = Number(body.total);
  }

  const entry = {
    id: uid(type === 'order' ? 'ord' : 'msg'),
    type,
    status: 'new',
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
    message,
    city,
    notes,
    items,
    total,
    source,
  };

  try {
    const inbox = await fetchInbox(env);
    const itemsList = Array.isArray(inbox.items) ? inbox.items : [];
    // Keep last 200
    itemsList.unshift(entry);
    const trimmed = itemsList.slice(0, 200);
    const payload = {
      updatedAt: new Date().toISOString(),
      items: trimmed,
    };
    const cloudJson = await uploadRawJson(env, inboxPublicId(env), payload);
    return json({
      ok: true,
      id: entry.id,
      createdAt: entry.createdAt,
      url: cloudJson.secure_url || cloudJson.url || null,
      count: trimmed.length,
    });
  } catch (err) {
    return json({ ok: false, error: err.message || String(err) }, 502);
  }
}

async function handleInbox(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const password = body?.password;
  if (!password || password !== env.ADMIN_PASSWORD) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }

  const action = body?.action || 'list';

  if (action === 'list') {
    const inbox = await fetchInbox(env);
    return json({
      ok: true,
      updatedAt: inbox.updatedAt,
      items: inbox.items || [],
      count: (inbox.items || []).length,
    });
  }

  if (action === 'setStatus') {
    const id = sanitizeStr(body?.id, 60);
    const status = sanitizeStr(body?.status, 20);
    if (!id || !['new', 'read', 'done'].includes(status)) {
      return json({ ok: false, error: 'id e status (new|read|done) obrigatórios' }, 400);
    }
    const inbox = await fetchInbox(env);
    const items = Array.isArray(inbox.items) ? inbox.items : [];
    let found = false;
    for (const it of items) {
      if (it.id === id) {
        it.status = status;
        found = true;
        break;
      }
    }
    if (!found) return json({ ok: false, error: 'Não encontrado' }, 404);
    const payload = { updatedAt: new Date().toISOString(), items };
    await uploadRawJson(env, inboxPublicId(env), payload);
    return json({ ok: true, id, status });
  }

  if (action === 'delete') {
    const id = sanitizeStr(body?.id, 60);
    if (!id) return json({ ok: false, error: 'id obrigatório' }, 400);
    const inbox = await fetchInbox(env);
    const items = (Array.isArray(inbox.items) ? inbox.items : []).filter((it) => it.id !== id);
    const payload = { updatedAt: new Date().toISOString(), items };
    await uploadRawJson(env, inboxPublicId(env), payload);
    return json({ ok: true, id });
  }

  return json({ ok: false, error: 'Ação desconhecida' }, 400);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'POST' && path === '/publish') {
      return handlePublish(request, env);
    }
    if (request.method === 'POST' && path === '/submit') {
      return handleSubmit(request, env);
    }
    if (request.method === 'POST' && path === '/inbox') {
      return handleInbox(request, env);
    }

    return json({
      ok: false,
      error: 'Not found. Use POST /publish, POST /submit, or POST /inbox',
    }, 404);
  },
};
