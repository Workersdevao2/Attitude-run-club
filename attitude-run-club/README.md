# Attitude Run Club — Website

Official multi-page website for **Attitude Run Club**.

**Live:** https://attitude-run-club.workers.dev (or your Cloudflare URL)

---

## Project Structure

```
attitude-run-club/
├── index.html              → Home
├── pages/
│   ├── planos.html         → Membership plans
│   ├── eventos.html        → Events
│   ├── roadmap.html        → 90-day roadmap
│   └── contacto.html       → Contact
├── css/
│   └── style.css           → Global styles
├── js/
│   └── main.js             → Cursor, language toggle, mobile menu
├── images/                 → Photos + logo
└── README.md
```

---

## Important Changes Log

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

## Deploy
Push this entire folder to GitHub → connect to Cloudflare Pages / Workers.  
After any change, make sure **HTML + CSS + JS** are all updated on the live site.
