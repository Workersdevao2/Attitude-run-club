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

  /** Approximate hex for colour swatches (name → fill) */
  const COLOR_HEX = {
    preto: '#1a1a1a',
    preta: '#1a1a1a',
    black: '#1a1a1a',
    branco: '#f2f2f2',
    branca: '#f2f2f2',
    white: '#f2f2f2',
    'off white': '#e8e4dc',
    'off-white': '#e8e4dc',
    offwhite: '#e8e4dc',
    azul: '#2c4a7c',
    blue: '#2c4a7c',
    cinza: '#6b6b6b',
    'cinza claro': '#a8a8a8',
    grey: '#6b6b6b',
    gray: '#6b6b6b',
    rosa: '#d4a0b0',
    pink: '#d4a0b0',
    bordô: '#6b2035',
    bordo: '#6b2035',
    burgundy: '#6b2035',
    castanho: '#6b4a32',
    'castanho caqui': '#8a7a55',
    caqui: '#8a7a55',
    khaki: '#8a7a55',
    brown: '#6b4a32',
    verde: '#2d5a3d',
    green: '#2d5a3d',
    vermelho: '#8b2020',
    red: '#8b2020',
    laranja: '#c45c20',
    orange: '#c45c20',
    amarelo: '#c9a227',
    yellow: '#c9a227',
    roxo: '#5a3a6e',
    purple: '#5a3a6e',
    bege: '#c4b09a',
    beige: '#c4b09a',
    navy: '#1a2744',
    marinho: '#1a2744',
  };

  function colorHex(name) {
    const key = String(name || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
    if (COLOR_HEX[key]) return COLOR_HEX[key];
    // partial match
    for (const k of Object.keys(COLOR_HEX)) {
      if (key.includes(k) || k.includes(key)) return COLOR_HEX[k];
    }
    return '#555555';
  }

  /**
   * Infer shop category from product names / id (no admin field required).
   * @returns {string} category key
   */
  function inferCategory(p) {
    if (p && p.category) return String(p.category).toLowerCase();
    const blob = [p.id, p.name_pt, p.name_en]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (/\b(kids|teens|infantil|crianc)/.test(blob)) return 'kids';
    if (/\b(short|shorts)\b/.test(blob)) return 'shorts';
    if (/\b(conjunto|set)\b/.test(blob) || /\bkit\b/.test(blob)) return 'conjuntos';
    if (/\b(legging|calca|macacao|fato|pants)\b/.test(blob)) return 'bottoms';
    if (/\b(jacket|casaco|pulover|pulôver|hoodie|wind)\b/.test(blob)) return 'outerwear';
    if (
      /\b(t-?shirt|tshirt|blusa|top|cropped|regata|singlet|long sleeve|polo)\b/.test(blob)
    )
      return 'tops';
    if (
      /\b(cap|pala|visor|mala|meia|sock|shaker|garrafa|toalha|bottle|towel|acessor)\b/.test(
        blob
      )
    )
      return 'acessorios';
    return 'outros';
  }

  const CATEGORY_META = {
    all: { pt: 'Todos', en: 'All' },
    shorts: { pt: 'Shorts', en: 'Shorts' },
    conjuntos: { pt: 'Conjuntos', en: 'Sets' },
    tops: { pt: 'Tops', en: 'Tops' },
    bottoms: { pt: 'Calças & Leggings', en: 'Bottoms' },
    outerwear: { pt: 'Casacos', en: 'Outerwear' },
    acessorios: { pt: 'Acessórios', en: 'Accessories' },
    kids: { pt: 'Kids & Teens', en: 'Kids & Teens' },
    outros: { pt: 'Outros', en: 'Other' },
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
      supplements: global.DEFAULT_SUPPLEMENTS || [],
      zones: global.DEFAULT_ZONES || [],
      texts: global.DEFAULT_TEXTS || { pt: {}, en: {} },
      images: global.DEFAULT_SITE_IMAGES || {},
    };

    const draftProducts = readLS(LS.products);
    const draftSupplements = readLS(LS.supplements);
    const draftZones = readLS(LS.zones);
    const draftTexts = readLS(LS.texts);
    const draftImages = readLS(LS.images);
    const publishedLocal = readLS(LS.published);

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
    const useDraftProducts = Array.isArray(draftProducts) && draftProducts.length > 0;
    const useDraftSupplements = Array.isArray(draftSupplements) && draftSupplements.length > 0;
    const useDraftZones = Array.isArray(draftZones) && draftZones.length > 0;

    const defById = Object.fromEntries((defaults.products || []).map((p) => [p.id, p]));
    function enrich(list) {
      return (list || []).map((p) => {
        const d = defById[p.id];
        if (!d) {
          return {
            ...p,
            colors: Array.isArray(p.colors) ? p.colors : [],
            category: p.category || inferCategory(p),
          };
        }
        const next = { ...p };
        if (!Array.isArray(next.colors) || !next.colors.length) {
          next.colors = Array.isArray(d.colors) ? [...d.colors] : [];
        }
        if (!Array.isArray(next.sizes) || !next.sizes.length) {
          if (Array.isArray(d.sizes) && d.sizes.length) next.sizes = [...d.sizes];
        }
        next.category = next.category || inferCategory(next);
        return next;
      });
    }

    const rawProducts = useDraftProducts ? draftProducts : base.products || defaults.products;
    const rawSupplements = useDraftSupplements
      ? draftSupplements
      : base.supplements || defaults.supplements;

    return {
      products: enrich(rawProducts).filter((p) => p.active !== false),
      supplements: (rawSupplements || [])
        .filter((s) => s && s.active !== false)
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
      zones: useDraftZones ? draftZones : base.zones || defaults.zones,
      texts: draftTexts && typeof draftTexts === 'object' ? draftTexts : base.texts || defaults.texts,
      images:
        draftImages && typeof draftImages === 'object'
          ? draftImages
          : base.images || defaults.images,
      source: useDraftProducts
        ? 'draft'
        : remote
          ? 'remote'
          : publishedLocal
            ? 'local-publish'
            : 'defaults',
    };
  }

  function resolveSiteUrl(url) {
    if (!url || typeof url !== 'string') return url;
    const u = url.trim();
    if (!u || /^https?:\/\//i.test(u) || u.startsWith('data:') || u.startsWith('/')) return u;
    // Root-relative assets (images/…) from pages/* need ../
    if (location.pathname.includes('/pages/') && (u.startsWith('images/') || u.startsWith('./images/'))) {
      return '../' + u.replace(/^\.\//, '');
    }
    return u;
  }

  function applySiteImages(images) {
    if (!images || typeof images !== 'object') return;
    document.querySelectorAll('[data-site-img]').forEach((el) => {
      const key = el.getAttribute('data-site-img');
      const url = resolveSiteUrl(images[key]);
      if (url) {
        if (el.tagName === 'IMG') el.src = url;
        else if (el.tagName === 'VIDEO') el.poster = url;
      }
    });
    document.querySelectorAll('[data-site-img-bg]').forEach((el) => {
      const key = el.getAttribute('data-site-img-bg');
      const url = resolveSiteUrl(images[key]);
      if (url) el.style.backgroundImage = `url('${url}')`;
    });
    if (images.hero) {
      document.documentElement.style.setProperty('--hero-bg', `url('${resolveSiteUrl(images.hero)}')`);
    }
  }

  function applyTexts(texts) {
    if (!texts || typeof global.translations !== 'object') return;
    ['pt', 'en'].forEach((lang) => {
      if (!texts[lang] || !global.translations[lang]) return;
      Object.assign(global.translations[lang], texts[lang]);
    });
    if (typeof global.setLanguage === 'function' && global.currentLang) {
      global.setLanguage(global.currentLang);
    }
  }

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolveImage(p, prefix) {
    let img = (p.image || '').trim();
    if (img && !/^https?:\/\//i.test(img) && !img.startsWith(prefix) && !img.startsWith('/')) {
      if (img.startsWith('images/')) img = prefix + img;
      else if (img.startsWith('../images/')) img = img;
      else img = prefix + 'images/' + img.replace(/^.*\//, '');
    }
    if (!img) {
      img =
        'data:image/svg+xml,' +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
            '<rect fill="%23111111" width="400" height="400"/>' +
            '<text x="200" y="205" text-anchor="middle" fill="%23555555" font-family="system-ui,sans-serif" font-size="14">Attitude</text>' +
            '</svg>'
        );
    }
    return img;
  }

  function buildColorSwatches(colors) {
    if (!colors || !colors.length) return '';
    const swatches = colors
      .map((c, ci) => {
        const hex = colorHex(c);
        const light = ['#f2f2f2', '#e8e4dc', '#a8a8a8', '#c4b09a', '#c9a227'].includes(hex);
        return `<button type="button" class="color-swatch${ci === 0 ? ' is-active' : ''}${light ? ' is-light' : ''}" data-color="${esc(c)}" title="${esc(c)}" style="--swatch:${hex}" aria-label="${esc(c)}" aria-pressed="${ci === 0 ? 'true' : 'false'}"></button>`;
      })
      .join('');
    return `<div class="color-swatches" role="listbox" aria-label="Cor">${swatches}</div>`;
  }

  function productCardHTML(p, pathPrefix, lang) {
    const prefix = pathPrefix != null ? pathPrefix : location.pathname.includes('/pages/') ? '../' : '';
    const name = lang === 'en' ? p.name_en || p.name_pt : p.name_pt || p.name_en;
    const desc = lang === 'en' ? p.desc_en || p.desc_pt : p.desc_pt || p.desc_en;
    const img = resolveImage(p, prefix);
    const sizes = p.sizes && p.sizes.length ? p.sizes : ['Único'];
    const sizeOpts = sizes
      .map((s, si) => `<option value="${esc(s)}"${si === 0 ? ' selected' : ''}>${esc(s)}</option>`)
      .join('');
    const colors = p.colors && p.colors.length ? p.colors : [];
    const colorSelect = colors.length
      ? `<select class="product-color" aria-label="Cor" hidden>${colors
          .map(
            (c, ci) =>
              `<option value="${esc(c)}"${ci === 0 ? ' selected' : ''}>${esc(c)}</option>`
          )
          .join('')}</select>`
      : `<select class="product-color" aria-label="Cor" hidden><option value="">—</option></select>`;
    const swatches = buildColorSwatches(colors);
    const priceFmt = (Number(p.price) || 0).toLocaleString('pt-AO');
    const cat = p.category || inferCategory(p);
    const searchBlob = [p.name_pt, p.name_en, p.desc_pt, p.desc_en, p.id]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return `
      <article class="product-card" data-id="${esc(p.id)}" data-name-pt="${esc(p.name_pt || '')}" data-name-en="${esc(p.name_en || '')}" data-price="${Number(p.price) || 0}" data-category="${esc(cat)}" data-search="${esc(searchBlob)}">
        <div class="product-img-wrap">
          <img src="${esc(img)}" alt="${esc(name)}" loading="lazy" decoding="async" width="400" height="400">
          <button type="button" class="product-quick-btn" data-quick="${esc(p.id)}" aria-label="Vista rápida">
            <span data-i18n="loja.quick">Vista rápida</span>
          </button>
        </div>
        <div class="product-body">
          <h3 class="product-name">${esc(name)}</h3>
          <p class="product-desc">${esc(desc || '')}</p>
          <p class="product-price">${priceFmt} <span>Kz</span></p>
          ${swatches}
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
  }

  /**
   * Render product cards into #productsGrid.
   * @param {Array} products
   * @param {string} pathPrefix
   * @param {{ append?: boolean }} opts
   */
  function renderProductGrid(products, pathPrefix, opts) {
    const grid = document.getElementById('productsGrid');
    if (!grid || !Array.isArray(products)) return;

    const lang = global.currentLang || document.documentElement.lang || 'pt';
    const html = products.map((p) => productCardHTML(p, pathPrefix, lang)).join('');

    if (opts && opts.append) {
      grid.insertAdjacentHTML('beforeend', html);
    } else {
      grid.innerHTML = html || '';
    }

    if (typeof global.setLanguage === 'function' && global.currentLang) {
      global.setLanguage(global.currentLang);
    }

    grid.dispatchEvent(new CustomEvent('arc:products-rendered'));
  }

  function suppCatLabel(cat, lang) {
    const map = global.SUPP_CATEGORY_LABELS || {};
    const row = map[cat];
    if (!row) return cat || '';
    return row[lang] || row.pt || row.en || cat;
  }

  function supplementCardHTML(s, lang) {
    const name = (lang === 'en' ? s.name_en || s.name_pt : s.name_pt || s.name_en) || s.id;
    const desc = (lang === 'en' ? s.desc_en || s.desc_pt : s.desc_pt || s.desc_en) || '';
    const cat = suppCatLabel(s.category, lang);
    const img = (s.image || '').trim();
    const visual = img
      ? '<div class="supp-visual"><img class="supp-photo" src="' +
        esc(resolveSiteUrl(img)) +
        '" alt="' +
        esc(name) +
        '" loading="lazy"></div>'
      : '<div class="supp-visual" aria-hidden="true"><div class="supp-jar"><div class="supp-jar-lid"></div><div class="supp-jar-body"></div></div></div>';
    const priceTbd =
      (global.translations &&
        global.translations[lang] &&
        global.translations[lang]['supp.priceTbd']) ||
      (lang === 'en' ? 'Price soon' : 'Preço em breve');
    return (
      '<article class="supp-card reveal">' +
      visual +
      '<div class="supp-body">' +
      (cat ? '<p class="supp-cat">' + esc(cat) + '</p>' : '') +
      '<h3 class="supp-name">' +
      esc(name) +
      '</h3>' +
      (desc ? '<p class="supp-desc">' + esc(desc) + '</p>' : '') +
      '<p class="supp-price-tbd">' +
      esc(priceTbd) +
      '</p>' +
      '</div></article>'
    );
  }

  function renderSupplementsGrid(list, opts) {
    const grid = document.getElementById((opts && opts.gridId) || 'suppGrid');
    if (!grid) return;
    const lang = global.currentLang || document.documentElement.lang || 'pt';
    const items = (list || []).filter((s) => s && s.active !== false);
    grid.innerHTML = items.map((s) => supplementCardHTML(s, lang)).join('') || '';
    if (typeof global.setLanguage === 'function' && global.currentLang) {
      global.setLanguage(global.currentLang);
    }
  }

  global.ARCCatalog = {
    loadCatalog,
    applySiteImages,
    applyTexts,
    renderProductGrid,
    renderSupplementsGrid,
    productCardHTML,
    inferCategory,
    colorHex,
    CATEGORY_META,
    esc,
  };
})(typeof window !== 'undefined' ? window : globalThis);
