# Attitude Run Club — Website

Official multi-page website for **Attitude Run Club**.

**Live:**
- https://attituderunclub.com
- https://www.attituderunclub.com
- Preview: https://attitude-run-club.pages.dev

**Hosting:** Cloudflare Pages (Git-connected, auto-deploy from `main`)

---

## Project Structure

```
attitude-run-club/
├── index.html              → Home
├── admin.html              → Staff panel (password)
├── pages/
│   ├── planos.html         → Membership plans
│   ├── eventos.html        → Events
│   ├── roadmap.html        → 90-day roadmap
│   ├── contacto.html       → Contact (form → Worker inbox)
│   ├── loja.html           → Shop (Attitude Sportwear)
│   └── checkout.html       → Checkout (inbox + WhatsApp)
├── css/
│   ├── style.css           → Public site
│   └── admin.css           → Admin UI
├── js/
│   ├── main.js             → i18n, menu, cart, checkout submit
│   ├── products.js         → Defaults + Cloudinary config
│   ├── catalog.js          → Load live catalog
│   └── admin.js            → CRUD, media, publish, Pedidos inbox
├── worker/                 → Cloudflare Worker API
│   ├── src/index.js        → /publish · /submit · /inbox
│   ├── wrangler.toml       → KV INBOX + deploy config
│   └── README.md
├── images/
├── BLUEPRINT.md
└── README.md
```

**API:** `https://attitude-run-club-publish.workersdevao.workers.dev`  
**Admin:** `/admin.html` → tab **Pedidos** (contacts + orders)

---

## Important Changes Log

### 2026-10-19 — Contact + orders inbox in admin

**Request:** Contact form and checkout orders appear in the admin panel (not only WhatsApp).

**How it works:**
- `POST /submit` — public (contact or order)
- `POST /inbox` — admin list / status / delete
- Storage: **Cloudflare KV** (`INBOX` binding) — reliable
- Admin tab **Pedidos** loads the inbox
- Checkout still opens WhatsApp; also saves to inbox
- Contact form uses a standalone script in `contacto.html`

**Files:**
- `worker/src/index.js` — `/submit`, `/inbox`, KV + Cloudinary fallback
- `worker/wrangler.toml` — `[[kv_namespaces]]` binding `INBOX`
- `worker/README.md` — deploy + test
- `pages/contacto.html` — form + inline submit
- `js/main.js` — checkout submit + success feedback
- `admin.html` / `js/admin.js` / `css/admin.css` — Pedidos UI

**Worker + KV (live):**
- URL: `https://attitude-run-club-publish.workersdevao.workers.dev`
- Binding: `env.INBOX` → KV namespace `fcb92e41…`
- Redeploy: `cd worker && npx wrangler deploy`
- Health check: submit/list JSON includes `"storage":"kv"`

---

### 2026-09-25 — Mobile Hamburger Menu
**Problem:** Nav links disappeared on mobile but no hamburger was present.

**Files changed:**
- `css/style.css` — Added `.hamburger` and `.mobile-menu` styles + media query rules
- `js/main.js` — Added hamburger toggle logic
- `index.html` — Added hamburger button + mobile menu
- `pages/planos.html` — Added hamburger button + mobile menu
- `pages/eventos.html` — Added hamburger button + mobile menu
- `pages/roadmap.html` — Added hamburger button + mobile menu
- `pages/contacto.html` — Added hamburger button + mobile menu

**How it works:**  
On screens ≤ 900px the desktop links and CTA hide, the hamburger appears. Clicking it opens a full-screen mobile menu.

### 2026-09-25 — Mobile Menu Close (X) Button
**Problem:** No clear X to close the mobile menu.

**Files changed:**
- `css/style.css` — Added `.mobile-close` styles
- `js/main.js` — Added close handler for the X button
- `index.html` — Added X close button inside mobile menu
- `pages/planos.html` — Added X close button
- `pages/eventos.html` — Added X close button
- `pages/roadmap.html` — Added X close button
- `pages/contacto.html` — Added X close button

**How it works:**  
A visible X appears in the top-right of the mobile menu. Clicking it (or any link, or the hamburger again) closes the menu.

### 2026-09-25 — Color System Redesign (Owner request)
**Request:** Remove red. Use 60% black · 30% white · 10% gray only.

**Files changed:**
- `css/style.css` — Full color system update
  - Removed `--red` / `--red-dark`
  - New variables: `--accent` (white), `--accent-soft` (light gray)
  - All buttons, labels, marquee, stats, badges, hovers, cursor updated
  - Contrast fixed for white-on-white issues

**Result:** Clean black / white / gray premium look. No red remaining.

### 2026-09-25 — Pillar Images
**Request:** Use 5 real photos for the 5 pillars.

**Files changed:**
- `images/pillar-01-corrida.jpg` — group run (Corrida)
- `images/pillar-02-lifestyle.jpg` — three women athletic (Lifestyle)
- `images/pillar-03-moda.jpg` — Attitude brand booth / flex (Moda)
- `images/pillar-04-educacao.jpg` — coach / circle talk (Educação)
- `images/pillar-05-pertencimento.jpg` — crowd energy (Pertencimento)
- `css/style.css` — pillar cards now use photo backgrounds + gradient overlay
- `index.html` — pillars section updated with the 5 images

### 2026-09-26 — Contact Hero Image
**Request:** Use coach-with-megaphone photo as Contact page hero; fit cleanly.

**Files changed:**
- `images/contacto-hero.jpg` (new)
- `css/style.css` — `.page-hero.has-bg` with cover + gradient for text readability
- `pages/contacto.html` — hero uses the new image
- `README.md` — changelog

**Fit notes:** `background-position: center 30%` keeps the subject (coach) framed; dark gradient ensures title stays readable.

---

### 2026-09-26 — Photo heroes on Planos / Roadmap / Eventos + all CTAs
**Request:** Add photo backgrounds to remaining heroes and CTA sections.

**Files changed:**
- `images/planos-hero.jpg` — smiling member in Attitude kit
- `images/roadmap-hero.jpg` — night run motion (headlamp)
- `images/cta-energy.jpg` — women group energy
- `images/cta-run.jpg` — motion blur runners
- `images/cta-community.jpg` — two members posing
- `css/style.css` — `.cta-section.has-bg` overlay support
- `pages/planos.html` — hero + CTA photos
- `pages/roadmap.html` — hero + CTA photos
- `pages/eventos.html` — hero + CTA photos
- `index.html` — final CTA photo
- `README.md` — changelog

---

### 2026-09-26 — Full PT/EN translation coverage
**Request:** Translate all page content on language toggle click.

**Files changed:**
- `js/main.js` — full translation dictionaries (~160 keys each for PT and EN)
- `index.html` — data-i18n on hero, pillars, stats, gallery, marquee, CTA, footer, nav
- `pages/planos.html` — plans, features, CTA, nav, footer
- `pages/eventos.html` — events, tags, CTA, nav, footer
- `pages/roadmap.html` — phases, items, CTA, nav, footer
- `pages/contacto.html` — contact labels, form, nav, footer
- `README.md` — changelog

**How it works:** Click PT or EN in the header. Preference is saved in localStorage (`arc-lang`).

---

### 2026-09-26 — Typography: Sora Bold + Sora Light
**Request:** Sora Bold for titles · Sora Light for body text.

**Files changed:**
- All HTML pages — Google Fonts link switched from Bebas Neue / Barlow to Sora (weights 300–800)
- `css/style.css` — font variables updated; body defaults to weight 300 (Light); all major titles/display elements set to weight 700 (Bold)
- `README.md` — changelog

**Result:** Clean modern typography. Titles = Sora Bold · Texts = Sora Light.

---

### 2026-09-26 — Eventos page: Past | Upcoming + formats
**Request:** “Ver Eventos” should show past events (left, with short recap) and upcoming events (right). Keep format cards. Mobile-friendly.

**Files changed:**
- `pages/eventos.html` — full redesign: two-column split (past left / upcoming right), 30 Oct “Attituders Let’s Go” as featured upcoming with poster + ticket.ao + WhatsApp; 3 placeholder past events with recaps; original 6 format cards kept below as “Formatos de eventos”
- `images/event-lets-go.jpg` — event poster from owner
- `css/style.css` — `.events-split`, `.calendar-card`, `.formats-section`; on ≤900px columns stack with **upcoming first**, then past
- `js/main.js` — new PT/EN keys for past, upcoming, formats section
- `README.md` — changelog

**Note:** Past event recaps are placeholders — replace when owner sends real history.

---

### 2026-10-06 — Pilares card 04 mobile cutoff fix
**Problem:** Pillar card 04 (Educação) text was cut off on mobile/tablet.

**Files changed:**
- `css/style.css` — higher `min-height` and tuned padding/type sizes for pillars at ≤1100px, ≤900px (2-col), and ≤600px (1-col) so long descriptions stay fully visible

### 2026-10-06 — Pillar 04 face visible on mobile
**Problem:** Coach's face on card 04 cropped out on mobile (background-position: center).

**Files changed:**
- `css/style.css` — `.pillar:nth-child(4)` uses `background-position: center 22%` (desktop), `12%` (≤900px), `18%` (≤600px) so the face stays in frame

---

### 2026-10-02 — Eventos: past events carousel + formats removed
**Request:** Owner asked for past events as a visual carousel (especially for mobile) that tells the story of each event. Formats section no longer needed.

**Files changed:**
- `pages/eventos.html` — replaced past-events list with horizontal carousel (5 slides); removed “Experiências / Formatos de eventos” block; upcoming event kept below
- `css/style.css` — carousel styles (track, slides, thin arrow buttons, dots); responsive: 3 slides desktop → 2 tablet → 1 mobile with swipe
- `js/main.js` — pure JS carousel (prev/next, dots, touch swipe)

**Images used (already in repo):** `start-01.jpg`, `run-02.jpg`, `community-01.jpg`, `run-01.jpg`

### 2026-10-10 — Missing night-run-01.jpg fallback
**Problem:** `images/night-run-01.jpg` was missing from the repo, so the home hero and first carousel slide showed a blank background.

**Files changed:**
- `index.html` — home hero background → `images/start-01.jpg`
- `pages/eventos.html` — first past-event slide → `../images/start-01.jpg`

---

## Membership Plans (Option A)
- Inscrição: **10.000 Kz** (one-time)
- Normal: **20.000 Kz/mês**
- Plus: **50.000 Kz/mês**
- VIP: **100.000 Kz/mês**

All CTAs link to the Regibox registration form.

---

## Language
PT / EN toggle is present (basic implementation). Expand translations in `js/main.js` as needed.

---

### 2026-10-10 — How to become a member (Regibox)
**Request:** Coach confirmed membership is through Regibox. Add a clear “how to become a member” flow.

**Files changed:**
- `pages/planos.html` — Full 4-step section above the plans grid + Regibox CTA
- `index.html` — Short 3-step teaser before the final CTA, linking to Planos
- `css/style.css` — `.how-section`, `.how-grid`, `.how-step`, `.how-teaser` styles + mobile grid
- `js/main.js` — Full PT/EN i18n keys for all how-to strings

**Flow:** Choose plan → Register on Regibox → Pay inscription + monthly → Join the tribe.

---

### 2026-10-10 — Live days-to-event + stats + ticket link
**Request:** Show remaining days to Attituders Let’s Go (30 Oct 2026, 19h); fix ticket URL; update impact stat.

**Files changed:**
- `js/main.js` — Live countdown to `2026-10-30T19:00:00+01:00` (updates `#daysToEvent`, `#roadmapDays`, and all `.js-days-to-event`); i18n for “Dias para o evento” / “Days to the event” and “Pessoas” / “People”
- `index.html` — Stats: live days count + **1000 Pessoas** (was ∞ Impacto)
- `pages/roadmap.html` — Hero title uses live day count (“X dias para mudar tudo”)
- `pages/eventos.html` — Days badge on upcoming event card; ticket link → `https://ticket.ao/event/attituders-lets-go/`
- `pages/planos.html` — Days badge under hero
- `pages/contacto.html` — Days badge under hero
- `css/style.css` — `.days-badge` styles

**Event target:** Attituders Let’s Go · Friday 30 October 2026 · 19h · ticket.ao

---

## Deploy
Push this entire folder to GitHub → connect to Cloudflare Pages / Workers.  
After any change, make sure **HTML + CSS + JS** are all updated on the live site.

---

### 2026-10-17 — Loja (Attitude Sportwear shop)
**Request:** Add physical products shop with WhatsApp checkout.

**Files added/changed:**
- `pages/loja.html` — product grid (7 items) + cart summary + WhatsApp checkout form
- `images/product-*.jpg` — tank, socks, black shorts, white shorts, visor, jacket, 2-in-1 shorts
- `css/style.css` — product cards, thin borders, checkout layout (mobile-first)
- `js/main.js` — cart logic, PT/EN i18n for Loja, WhatsApp pre-filled order message
- All pages — **Loja** link in desktop nav, mobile menu and footer

**Checkout flow:** Add products (size + qty) → fill name / phone / city → “Enviar pedido no WhatsApp” opens `wa.me/244933953989` with order + client data pre-filled.

**Note:** Prices are indicative (Kz). Adjust in `data-price` attributes on each product card when final retail prices are confirmed. Member discounts (10/20/30%) remain as stated on Planos.

---

### 2026-10-18 — Hamburger not showing on phones (Honor 10 Lite)
**Problem:** Hamburger menu missing on narrow Android phones (~360px). Long logo text pushed the button off-screen (body `overflow-x: hidden`), and the 28×28 target was easy to miss.

**Files changed:**
- `css/style.css`
  - `.nav-right` / `.hamburger` → `flex-shrink: 0` so they never get compressed
  - `.nav-logo` → `min-width: 0` so it can shrink instead of overflowing
  - Hamburger size → 44×44 (proper touch target), bars 22px wide
  - ≤900px: smaller logo type/image, tighter nav padding, `display: flex !important` on hamburger

**How to verify:** Open on phone ≤900px width — three white bars should sit at the right of the header next to PT/EN.

---

### 2026-10-18 — Migrated hosting: Worker → Cloudflare Pages
**Change:** Site was previously deployed as a Cloudflare Worker with static assets. Moved to **Cloudflare Pages** for Git auto-deploy and cleaner static hosting.

**Domains (Active + SSL):**
- `attituderunclub.com`
- `www.attituderunclub.com`
- Preview: `attitude-run-club.pages.dev`

**Notes:**
- Custom domains were removed from the old Worker first (Worker-managed DNS is read-only), then added on the Pages project.
- Automatic deployments enabled from `main`.
- Old Worker can be deleted once Pages is confirmed stable.
- Future API / admin: use Pages Functions (`functions/`) + D1/KV/R2 bindings on this same project.

---

### 2026-10-18 — Admin panel + Publish API (Cloudinary + Worker)

**Request:** Set up staff admin and live catalog following the Site + Admin Blueprint.

**Added:**
- `admin.html` — password-gated staff panel (products, zones, texts, site images, media library)
- `css/admin.css` — mobile-first admin UI (sticky Guardar/Publicar, modals, cards)
- `js/products.js` — default catalog seed (7 products), zones, texts, Cloudinary config placeholders
- `js/catalog.js` — loadCatalog (draft → remote → defaults), renderProductGrid, applySiteImages/Texts
- `js/admin.js` — CRUD, media upload (unsigned preset), publish via Worker
- `worker/` — Cloudflare Worker (`POST /publish`) signs raw upload of `catalog.json` to Cloudinary
- `BLUEPRINT.md` — architecture notes for this brand

**Public loja:** product grid is now rendered from the live catalog (falls back to defaults in `products.js`). Cart + WhatsApp checkout unchanged (`arc-cart`).

**Default admin password:** `attitude2026` — change after handoff.

**Deploy checklist:**
1. Create Cloudinary cloud + unsigned preset + folder `attitude-run-club`
2. `cd worker && npx wrangler deploy` + put 4 secrets
3. Set `PUBLISH_URL` in `js/admin.js`
4. Set `CATALOG_JSON_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET` in `js/products.js`
5. Smoke-test: admin → upload → assign → Publicar → hard-refresh loja

See `BLUEPRINT.md` and `worker/README.md` for full details.
