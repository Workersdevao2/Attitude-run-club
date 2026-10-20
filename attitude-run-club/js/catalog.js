/**
 * Attitude Run Club — Live catalog loader
 * Merge order: localStorage drafts → remote catalog.json → DEFAULT_* fallbacks
 */
(function (global) {
  'use strict';

  const LS = {
    products: 'arc_products_override',
    zones: 'arc_zones_override',
    texts: 'arc_texts_override',
    images: 'arc_images_override',
    published: 'arc_catalog_published',
  };

  function readLS(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Resolve final catalog for the public site.
   * @returns {Promise<{products, zones, texts, images, source}>}
   */
  async function loadCatalog() {
    const defaults = {
      products: global.DEFAULT_PRODUCTS || [],
      zones: global.DEFAULT_ZONES || [],
      texts: global.DEFAULT_TEXTS || { pt: {}, en: {} },
      images: global.DEFAULT_SITE_IMAGES || {},
    };

    // 1) Admin drafts (same browser preview)
    const draftProducts = readLS(LS.products);
    const draftZones = readLS(LS.zones);
    const draftTexts = readLS(LS.texts);
    const draftImages = readLS(LS.images);

    // 2) Last successful publish stored locally (fallback when remote empty)
    const publishedLocal = readLS(LS.published);

    // 3) Remote Cloudinary catalog
    let remote = null;
    const url = global.CATALOG_JSON_URL || '';
    if (url) {
      try {
        const res = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), {
          cache: 'no-store',
        });
        if (res.ok) remote = await res.json();
      } catch (_) {
        /* keep defaults */
      }
    }

    const base = remote || publishedLocal || defaults;

    // Draft only wins if it has at least one product (empty [] must not blank the shop)
    const useDraftProducts = Array.isArray(draftProducts) && draftProducts.length > 0;
    const useDraftZones = Array.isArray(draftZones) && draftZones.length > 0;

    return {
      products: (useDraftProducts
        ? draftProducts
        : (base.products || defaults.products)
      ).filter((p) => p.active !== false),
      zones: useDraftZones ? draftZones : (base.zones || defaults.zones),
      texts: draftTexts && typeof draftTexts === 'object' ? draftTexts : (base.texts || defaults.texts),
      images: draftImages && typeof draftImages === 'object' ? draftImages : (base.images || defaults.images),
      source: useDraftProducts ? 'draft' : remote ? 'remote' : publishedLocal ? 'local-publish' : 'defaults',
    };
  }

  /** Apply site image slots: data-site-img on <img>, data-site-img-bg on elements */
  function applySiteImages(images) {
    if (!images || typeof images !== 'object') return;
    document.querySelectorAll('[data-site-img]').forEach((el) => {
      const key = el.getAttribute('data-site-img');
      const url = images[key];
      if (url) {
        if (el.tagName === 'IMG') el.src = url;
        else if (el.tagName === 'VIDEO') el.poster = url;
      }
    });
    document.querySelectorAll('[data-site-img-bg]').forEach((el) => {
      const key = el.getAttribute('data-site-img-bg');
      const url = images[key];
      if (url) {
        el.style.backgroundImage = `url('${url}')`;
      }
    });
    // CSS variables for optional use
    if (images.hero) {
      document.documentElement.style.setProperty('--hero-bg', `url('${images.hero}')`);
    }
  }

  /** Merge catalog texts into existing translations object (if present) */
  function applyTexts(texts) {
    if (!texts || typeof global.translations !== 'object') return;
    ['pt', 'en'].forEach((lang) => {
      if (!texts[lang] || !global.translations[lang]) return;
      Object.assign(global.translations[lang], texts[lang]);
    });
    // Re-apply current language if setLanguage exists
    if (typeof global.setLanguage === 'function' && global.currentLang) {
      global.setLanguage(global.currentLang);
    }
  }

  /**
   * Render product cards into #productsGrid from catalog products.
   * Path prefix: '' on home, '../' on pages/*
   */
  function renderProductGrid(products, pathPrefix) {
    const grid = document.getElementById('productsGrid');
    if (!grid || !Array.isArray(products)) return;

    const prefix = pathPrefix != null ? pathPrefix : (location.pathname.includes('/pages/') ? '../' : '');
    const lang = global.currentLang || document.documentElement.lang || 'pt';

    grid.innerHTML = products
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((p, i) => {
        const name = lang === 'en' ? (p.name_en || p.name_pt) : (p.name_pt || p.name_en);
        const desc = lang === 'en' ? (p.desc_en || p.desc_pt) : (p.desc_pt || p.desc_en);
        let img = (p.image || '').trim();
        if (img && !/^https?:\/\//i.test(img) && !img.startsWith(prefix) && !img.startsWith('/')) {
          // normalize images/… relative to site root
          if (img.startsWith('images/')) img = prefix + img;
          else if (img.startsWith('../images/')) img = img;
          else img = prefix + 'images/' + img.replace(/^.*\//, '');
        }
        // Avoid empty src — Safari can blow out layout on broken/empty images
        if (!img) {
          img = 'data:image/svg+xml,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
            '<rect fill="%23111111" width="400" height="400"/>' +
            '<text x="200" y="205" text-anchor="middle" fill="%23555555" font-family="system-ui,sans-serif" font-size="14">Attitude</text>' +
            '</svg>'
          );
        }
        const sizes = (p.sizes && p.sizes.length) ? p.sizes : ['Único'];
        const sizeOpts = sizes
          .map((s, si) => `<option value="${esc(s)}"${si === 0 ? ' selected' : ''}>${esc(s)}</option>`)
          .join('');
        const colors = (p.colors && p.colors.length) ? p.colors : [];
        const colorSelect = colors.length
          ? `<label class="color-label" data-i18n="loja.color">Cor</label>
            <select class="product-color" aria-label="Cor">${colors.map((c, ci) =>
              `<option value="${esc(c)}"${ci === 0 ? ' selected' : ''}>${esc(c)}</option>`
            ).join('')}</select>`
          : `<select class="product-color" aria-label="Cor" hidden><option value="">—</option></select>`;
        const priceFmt = (Number(p.price) || 0).toLocaleString('pt-AO');

        // No .reveal class — products load async; reveal observer only runs once on page load
        return `
      <article class="product-card" data-id="${esc(p.id)}" data-name-pt="${esc(p.name_pt || '')}" data-name-en="${esc(p.name_en || '')}" data-price="${Number(p.price) || 0}">
        <div class="product-img-wrap">
          <img src="${esc(img)}" alt="${esc(name)}" loading="lazy" decoding="async" width="400" height="400">
        </div>
        <div class="product-body">
          <h3 class="product-name">${esc(name)}</h3>
          <p class="product-desc">${esc(desc || '')}</p>
          <p class="product-price">${priceFmt} <span>Kz</span></p>
          <div class="product-meta">
            <label class="size-label" data-i18n="loja.size">Tamanho</label>
            <select class="product-size" aria-label="Tamanho">${sizeOpts}</select>
            ${colorSelect}
            <label class="qty-label" data-i18n="loja.qty">Qtd</label>
            <div class="qty-stepper" role="group" aria-label="Quantidade">
              <button type="button" class="qty-btn qty-minus" aria-label="Diminuir">−</button>
              <input type="number" class="product-qty" min="1" max="99" value="1" readonly inputmode="numeric" aria-label="Quantidade">
              <button type="button" class="qty-btn qty-plus" aria-label="Aumentar">+</button>
            </div>
          </div>
          <button type="button" class="product-add btn-outline-thin" data-i18n="loja.add">Adicionar</button>
        </div>
      </article>`;
      })
      .join('');

    // Re-apply i18n labels on new nodes
    if (typeof global.setLanguage === 'function' && global.currentLang) {
      global.setLanguage(global.currentLang);
    }

    // Notify cart module that grid was rebuilt
    grid.dispatchEvent(new CustomEvent('arc:products-rendered'));
  }

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  global.ARCCatalog = {
    loadCatalog,
    applySiteImages,
    applyTexts,
    renderProductGrid,
  };
})(typeof window !== 'undefined' ? window : globalThis);
