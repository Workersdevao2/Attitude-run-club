/**
 * Attitude Run Club — API Worker
 *
 * POST /publish  — admin publishes catalog.json (password + catalog)
 * POST /submit   — public: contact message or shop order → inbox
 * POST /inbox    — admin lists / updates inbox (password)
 *
 * Inbox storage priority:
 *   1) Cloudflare KV binding INBOX (reliable)
 *   2) Cloudinary raw JSON fallback (legacy)
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

function uid(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function sanitizeStr(v, max = 500) {
  return String(v ?? '').trim().slice(0, max);
}

function emptyInbox() {
  return { updatedAt: null, items: [] };
}

// ── Inbox storage (KV preferred) ───────────────────────────────────────────

async function fetchInbox(env) {
  if (env.INBOX) {
    try {
      const data = await env.INBOX.get('items', { type: 'json' });
      if (data && Array.isArray(data.items)) return data;
      return emptyInbox();
    } catch {
      return emptyInbox();
    }
  }
  // Legacy Cloudinary fallback
  return fetchInboxCloudinary(env);
}

async function saveInbox(env, payload) {
  if (env.INBOX) {
    await env.INBOX.put('items', JSON.stringify(payload));
    return { ok: true, storage: 'kv' };
  }
  const cloudJson = await uploadRawJson(env, `${folderOf(env)}/inbox`, payload);
  return {
    ok: true,
    storage: 'cloudinary',
    url: cloudJson.secure_url || cloudJson.url || null,
  };
}

async function fetchInboxCloudinary(env) {
  const cloud = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !apiSecret) return emptyInbox();

  try {
    const auth = btoa(`${apiKey}:${apiSecret}`);
    // Prefer resource with .json public_id (matches upload filename behaviour)
    for (const pid of [`${folderOf(env)}/inbox`, `${folderOf(env)}/inbox.json`]) {
      const metaUrl =
        `https://api.cloudinary.com/v1_1/${cloud}/resources/raw/upload/` +
        encodeURIComponent(pid);
      const metaRes = await fetch(metaUrl, {
        headers: { Authorization: 'Basic ' + auth },
      });
      if (!metaRes.ok) continue;
      const meta = await metaRes.json().catch(() => null);
      const secure = meta?.secure_url || meta?.url;
      if (!secure) continue;
      // Versioned URL — avoid stale CDN edge without version
      const res = await fetch(secure + (secure.includes('?') ? '&' : '?') + 't=' + Date.now());
      if (!res.ok) continue;
      const data = await res.json().catch(() => null);
      if (data && Array.isArray(data.items)) return data;
    }
  } catch {
    /* empty */
  }
  return emptyInbox();
}

async function uploadRawJson(env, publicId, payload) {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Server misconfigured: Cloudinary secrets missing');
  }

  const timestamp = Math.floor(Date.now() / 1000);
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

// ── /publish ───────────────────────────────────────────────────────────────

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
    supplements: Array.isArray(catalog.supplements) ? catalog.supplements : [],
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

// ── /submit ────────────────────────────────────────────────────────────────

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
  if (type === 'contact' && !message) {
    return json({ ok: false, error: 'Mensagem é obrigatória' }, 400);
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
    itemsList.unshift(entry);
    const trimmed = itemsList.slice(0, 200);
    const payload = {
      updatedAt: new Date().toISOString(),
      items: trimmed,
    };
    const saved = await saveInbox(env, payload);
    return json({
      ok: true,
      id: entry.id,
      createdAt: entry.createdAt,
      count: trimmed.length,
      storage: saved.storage || null,
      url: saved.url || null,
    });
  } catch (err) {
    return json({ ok: false, error: err.message || String(err) }, 502);
  }
}

// ── /inbox ─────────────────────────────────────────────────────────────────

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
      storage: env.INBOX ? 'kv' : 'cloudinary',
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
    await saveInbox(env, payload);
    return json({ ok: true, id, status });
  }

  if (action === 'delete') {
    const id = sanitizeStr(body?.id, 60);
    if (!id) return json({ ok: false, error: 'id obrigatório' }, 400);
    const inbox = await fetchInbox(env);
    const items = (Array.isArray(inbox.items) ? inbox.items : []).filter((it) => it.id !== id);
    const payload = { updatedAt: new Date().toISOString(), items };
    await saveInbox(env, payload);
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
