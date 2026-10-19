# Site + Admin Blueprint — Attitude Run Club

Reusable architecture for small e‑commerce / brochure sites with a staff admin panel.

Adapted from the Naravazz Diversos pattern for **Attitude Run Club**.

## Stack

* Pure HTML / CSS / JS (no framework, no build step)
* Cloudflare Pages — static site
* Cloudflare Worker — publish API + inbox (`/publish`, `/submit`, `/inbox`)
* Cloudflare KV — inbox for contacts and orders (`INBOX` binding)
* Cloudinary — media uploads (unsigned preset) + live `catalog.json` (signed upload via Worker)
* localStorage — admin drafts / same-browser preview
* Orders: saved to admin inbox + WhatsApp (no payment backend)
* Contact form: saved to admin inbox (Pedidos tab)

## Folders

```
attitude-run-club/
├── index.html
├── admin.html                 # Staff panel (password-gated)
├── pages/
│   ├── loja.html              # Shop (renders from catalog)
│   ├── checkout.html
│   └── …
├── css/
│   ├── style.css              # Public site
│   └── admin.css              # Admin UI
├── js/
│   ├── products.js            # DEFAULT_PRODUCTS, zones, texts, Cloudinary config
│   ├── catalog.js             # loadCatalog / renderProductGrid / applySiteImages
│   ├── main.js                # Cart, i18n, mobile menu, carousel
│   └── admin.js               # CRUD, media, publish
├── images/
├── worker/
│   ├── src/index.js
│   ├── wrangler.toml
│   └── README.md
├── BLUEPRINT.md
└── README.md
```

## Data model (live catalog)

Published file: `catalog.json` on Cloudinary (`{folder}/catalog`).

```json
{
  "updatedAt": "2026-10-18T17:00:00.000Z",
  "products": [
    {
      "id": "tank",
      "name_pt": "Attitude Race Tank",
      "name_en": "Attitude Race Tank",
      "desc_pt": "…",
      "desc_en": "…",
      "price": 18000,
      "image": "https://res.cloudinary.com/…/…",
      "sizes": ["S", "M", "L", "XL"],
      "active": true,
      "order": 1
    }
  ],
  "zones": [{ "id": "talatona", "name": "Talatona", "price": 0 }],
  "texts": { "pt": { "hero.title1": "Corre Com" }, "en": {} },
  "images": { "hero": "https://…", "logo": "https://…" }
}
```

Remote URL pattern:

```
https://res.cloudinary.com/{CLOUD_NAME}/raw/upload/attitude-run-club/catalog.json
```

## Public site (how data is read)

1. Load `products.js` → defaults.
2. `catalog.js` fetches remote `catalog.json` (cache-bust `?t=`).
3. Apply in order:
   * localStorage drafts (`arc_*_override`) — admin preview same browser
   * Remote catalog (everyone after publish)
   * Fall back to `DEFAULT_*`
4. Cart: localStorage key `arc-cart`.
5. Checkout → WhatsApp (`wa.me/244933953989`).

## Admin panel

| Area            | localStorage draft       | Publish                          |
|-----------------|--------------------------|----------------------------------|
| Products        | `arc_products_override`  | `catalog.json` → products        |
| Delivery zones  | `arc_zones_override`     | zones                            |
| Site texts      | `arc_texts_override`     | texts                            |
| Site images     | `arc_images_override`    | images                           |
| Media library   | `arc_media_library`      | URLs used on products/slots only |

* **Guardar rascunho** — this browser only.
* **Publicar na loja** — `POST { password, catalog }` → Worker → signed Cloudinary upload.

Default password: `attitude2026` (change after handoff via admin UI or `localStorage.arc_admin_pw`).

## Worker deploy

```bash
cd worker
npx wrangler deploy
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put CLOUDINARY_CLOUD_NAME
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
```

Then set in `js/admin.js`:

```js
const PUBLISH_URL = 'https://attitude-run-club-publish.<account>.workers.dev/publish';
```

And in `js/products.js`:

```js
const CATALOG_JSON_URL = 'https://res.cloudinary.com/<cloud>/raw/upload/attitude-run-club/catalog.json';
const CLOUDINARY_CLOUD_NAME = '<cloud>';
const CLOUDINARY_UPLOAD_PRESET = '<unsigned_preset>';
```

## Cloudinary checklist

1. Create cloud + folder `attitude-run-club`.
2. Create **unsigned** upload preset (media only, overwrite off, unique filenames).
3. API key + secret → Worker secrets only.
4. Catalog public_id: `attitude-run-club/catalog` (overwrite on each publish).

## Staff workflow

1. Open `/admin.html` → password.
2. Edit products / zones / texts / site images / upload media.
3. Optional **Guardar rascunho** → preview loja in the same browser.
4. **Publicar na loja** → all visitors get new catalog on next load.

No site redeploy for catalog or site-image changes (only for HTML/CSS/JS code).

## Security model

* Unsigned media: anyone who knows cloud name + preset can upload; cannot access dashboard or secret.
* Catalog: only Worker with correct admin password can overwrite `catalog.json`.
* Change default admin password after handoff.
* Media “delete” in admin = library list only.

## What this is good for

* Small shops, WhatsApp orders, staff updating prices/photos from a phone
* Low cost (Cloudinary free + Cloudflare free tier)
* Secrets stay on the server

## What it is not

* Multi-warehouse inventory / strong multi-user auth
* PCI card payments
* Automatic Cloudinary binary deletion from the admin UI
