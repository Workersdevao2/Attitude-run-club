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
