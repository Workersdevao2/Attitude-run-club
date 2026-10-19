# Attitude Run Club — API Worker

Cloudflare Worker for:

- **Publish catalog** → Cloudinary `catalog.json` (admin)
- **Inbox** → contact messages + shop orders (public submit, admin list)

Live: `https://attitude-run-club-publish.workersdevao.workers.dev`

---

## Status

- **Live:** `https://attitude-run-club-publish.workersdevao.workers.dev`
- **KV INBOX:** bound and active (`fcb92e41fd214f4db515b077da8f26e8`)
- Deploy output should list: `env.INBOX (…)  KV Namespace`
- Submit/list responses should include `"storage":"kv"`

## Deploy

```bash
cd worker
npx wrangler deploy
```

On success you should see the `INBOX` KV binding listed. **No** warning about unexpected top-level `binding` / `id`.

Secrets (only if missing):

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put CLOUDINARY_CLOUD_NAME
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
```

### wrangler.toml (current)

```toml
[[kv_namespaces]]
binding = "INBOX"
id = "fcb92e41fd214f4db515b077da8f26e8"
preview_id = "d01a348fb8204d218b0acac23d20eae3"
```

`[[kv_namespaces]]` must stay uncommented. If Wrangler warns about top-level `binding`/`id`/`preview_id`, the table header is missing and KV is not bound.

KV was created once with:
`npx wrangler kv namespace create INBOX` and `--preview`.

---

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

Contact:

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

Order:

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

Success: `{ "ok": true, "id": "msg_…", "count": N, "storage": "kv" }`

- **Production uses KV** (`storage: "kv"`).
- Cloudinary `inbox.json` only if KV binding is missing (not recommended).

### `POST /inbox` — admin only

```json
{ "password": "…", "action": "list" }
{ "password": "…", "action": "setStatus", "id": "msg_…", "status": "read|done|new" }
{ "password": "…", "action": "delete", "id": "msg_…" }
```

List success includes `"storage": "kv"` when KV is active.

---

## Quick test

```bash
# Submit contact
curl -sS -X POST "https://attitude-run-club-publish.workersdevao.workers.dev/submit" \
  -H "Content-Type: application/json" \
  -d '{"type":"contact","name":"Test","message":"hello","source":"contacto"}'

# List inbox (admin password)
curl -sS -X POST "https://attitude-run-club-publish.workersdevao.workers.dev/inbox" \
  -H "Content-Type: application/json" \
  -d '{"password":"YOUR_ADMIN_PASSWORD","action":"list"}'
```

Both responses should show `"storage":"kv"`.

---

## Catalog URL (public site)

```
https://res.cloudinary.com/ev6fgna8/raw/upload/attitude-run-club/catalog.json
```

Set as `CATALOG_JSON_URL` in `js/products.js`.

API base used in:

- `js/admin.js` → `/publish`, `/inbox`
- `js/main.js` → `/submit` (checkout)
- `pages/contacto.html` → `/submit` (inline script)

---

## Security

- Only `ADMIN_PASSWORD` can publish catalog or read/update inbox.
- `/submit` is public (rate-limit later if needed).
- Cloudinary API secret never ships in client JS.
- Media uploads use an **unsigned** Cloudinary preset from the browser.
- Change default admin password after handoff.
- Do **not** commit `wrangler-account.json` or secret values.
