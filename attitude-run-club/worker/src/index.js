/**
 * Attitude Run Club — Publish API (Cloudflare Worker)
 *
 * POST /publish
 * Body: { password: string, catalog: { products, zones, texts, images, updatedAt? } }
 *
 * Validates ADMIN_PASSWORD, then signed raw upload of catalog.json to Cloudinary.
 * Secrets stay on the Worker — never sent to the browser.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/publish') {
      return json({ ok: false, error: 'Not found. Use POST /publish' }, 404);
    }

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

    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;
    const folder = env.CLOUDINARY_FOLDER || 'attitude-run-club';

    if (!cloudName || !apiKey || !apiSecret) {
      return json({ ok: false, error: 'Server misconfigured: Cloudinary secrets missing' }, 500);
    }

    // Normalize catalog
    const payload = {
      updatedAt: catalog.updatedAt || new Date().toISOString(),
      products: Array.isArray(catalog.products) ? catalog.products : [],
      zones: Array.isArray(catalog.zones) ? catalog.zones : [],
      texts: catalog.texts && typeof catalog.texts === 'object' ? catalog.texts : { pt: {}, en: {} },
      images: catalog.images && typeof catalog.images === 'object' ? catalog.images : {},
    };

    const publicId = `${folder}/catalog`;
    const timestamp = Math.floor(Date.now() / 1000);
    // Signed params for raw upload (overwrite existing catalog)
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = await sha1Hex(paramsToSign);

    const form = new FormData();
    form.append('file', new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), 'catalog.json');
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('public_id', publicId);
    form.append('signature', signature);
    // resource_type=raw is set via upload URL path

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

    let cloudRes;
    try {
      cloudRes = await fetch(uploadUrl, { method: 'POST', body: form });
    } catch (err) {
      return json({ ok: false, error: 'Cloudinary network error: ' + (err.message || String(err)) }, 502);
    }

    const cloudJson = await cloudRes.json().catch(() => ({}));
    if (!cloudRes.ok) {
      return json({
        ok: false,
        error: cloudJson.error?.message || cloudJson.message || 'Cloudinary upload failed',
        details: cloudJson,
      }, 502);
    }

    const secureUrl = cloudJson.secure_url || cloudJson.url || null;
    return json({
      ok: true,
      updatedAt: payload.updatedAt,
      url: secureUrl,
      public_id: cloudJson.public_id || publicId,
      products: payload.products.length,
      zones: payload.zones.length,
    });
  },
};
