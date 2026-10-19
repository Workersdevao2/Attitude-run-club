# Attitude Run Club — Publish Worker

Small Cloudflare Worker that accepts admin publishes and writes `catalog.json` to Cloudinary (signed raw upload). Secrets never leave the Worker.

## Deploy

```bash
cd worker
npx wrangler deploy
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put CLOUDINARY_CLOUD_NAME
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
# optional:
# npx wrangler secret put CLOUDINARY_FOLDER   # default: attitude-run-club
```

After deploy, copy the `*.workers.dev` URL (e.g. `https://attitude-run-club-publish.<account>.workers.dev`) into `js/admin.js` as `PUBLISH_URL`.

## Endpoints

### `POST /publish` — admin only

```json
{
  "password": "your-admin-password",
  "catalog": {
    "products": [],
    "zones": [],
    "texts": { "pt": {}, "en": {} },
    "images": {}
  }
}
```

Success: `{ "ok": true, "updatedAt": "...", "url": "https://res.cloudinary.com/…/catalog.json", … }`

### `POST /submit` — public (contact + orders)

```json
{
  "type": "contact",
  "name": "Ana",
  "email": "ana@email.com",
  "phone": "+244…",
  "message": "Olá",
  "source": "contacto"
}
```

Or order:

```json
{
  "type": "order",
  "name": "Ana",
  "phone": "+244…",
  "city": "Talatona",
  "notes": "",
  "items": [{ "id": "tank", "name": "Tank", "size": "M", "qty": 1, "price": 18000 }],
  "total": 18000,
  "source": "checkout"
}
```

Saved to Cloudinary `{folder}/inbox.json`.

### `POST /inbox` — admin only

```json
{ "password": "…", "action": "list" }
{ "password": "…", "action": "setStatus", "id": "msg_…", "status": "read|done|new" }
{ "password": "…", "action": "delete", "id": "msg_…" }
```

## Catalog URL (public site)

```
https://res.cloudinary.com/ev6fgna8/raw/upload/attitude-run-club/catalog.json
```

Already set as `CATALOG_JSON_URL` in `js/products.js`.

## Secrets for this project

```bash
npx wrangler secret put ADMIN_PASSWORD          # e.g. attitude2026
npx wrangler secret put CLOUDINARY_CLOUD_NAME   # ev6fgna8
npx wrangler secret put CLOUDINARY_API_KEY      # 756438622497218
npx wrangler secret put CLOUDINARY_API_SECRET   # from Cloudinary dashboard
```

## Security

- Only requests with the correct `ADMIN_PASSWORD` can overwrite the catalog.
- Media uploads use an **unsigned** Cloudinary preset from the browser (separate from this Worker).
- API secret and Google client secret must never ship in client-side JS.
- Change the default admin password after handoff.
