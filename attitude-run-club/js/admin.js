/**
 * Attitude Run Club — Admin panel logic
 * Drafts in localStorage · Publish via Worker → Cloudinary catalog.json
 */
(function () {
  'use strict';

  // ── Config (override after deploy) ──────────────────────────────────────
  const API_BASE = 'https://attitude-run-club-publish.workersdevao.workers.dev';
  const PUBLISH_URL = API_BASE + '/publish';
  const INBOX_URL = API_BASE + '/inbox';
  const DEFAULT_ADMIN_PASSWORD = 'attitude2026'; // change after handoff
  const LS = {
    auth: 'arc_admin_auth',
    products: 'arc_products_override',
    zones: 'arc_zones_override',
    texts: 'arc_texts_override',
    images: 'arc_images_override',
    media: 'arc_media_library',
  };

  // ── State ───────────────────────────────────────────────────────────────
  let products = [];
  let zones = [];
  let texts = { pt: {}, en: {} };
  let images = {};
  let media = [];
  let inboxItems = [];
  let inboxFilter = 'all';
  let editingId = null;
  let pickerTarget = null; // { type: 'product'|'slot', id/key }

  function adminPassword() {
    return localStorage.getItem('arc_admin_pw') || DEFAULT_ADMIN_PASSWORD;
  }

  // ── DOM ─────────────────────────────────────────────────────────────────
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const loginScreen = $('#loginScreen');
  const adminApp = $('#adminApp');
  const loginForm = $('#loginForm');
  const loginError = $('#loginError');
  const passwordInput = $('#adminPassword');

  // ── Auth ────────────────────────────────────────────────────────────────
  function isAuthed() {
    return sessionStorage.getItem(LS.auth) === '1' || localStorage.getItem(LS.auth) === '1';
  }
  function setAuth(remember) {
    sessionStorage.setItem(LS.auth, '1');
    if (remember) localStorage.setItem(LS.auth, '1');
  }
  function clearAuth() {
    sessionStorage.removeItem(LS.auth);
    localStorage.removeItem(LS.auth);
  }
  function showApp() {
    if (loginScreen) {
      loginScreen.hidden = true;
      loginScreen.setAttribute('hidden', '');
    }
    if (adminApp) {
      adminApp.hidden = false;
      adminApp.removeAttribute('hidden');
    }
    document.body.classList.remove('no-sticky-pad');
    loadAll();
    renderAll();
    if (typeof updatePublishStrip === 'function') updatePublishStrip();
    const undoBtn = document.getElementById('btnUndoDraft');
    if (undoBtn) undoBtn.hidden = true;
  }
  function showLogin() {
    if (loginScreen) {
      loginScreen.hidden = false;
      loginScreen.removeAttribute('hidden');
    }
    if (adminApp) {
      adminApp.hidden = true;
      adminApp.setAttribute('hidden', '');
    }
    document.body.classList.add('no-sticky-pad');
    if (passwordInput) passwordInput.value = '';
  }

  // Password show / hide
  const passwordToggle = $('#passwordToggle');
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const showing = passwordInput.type === 'text';
      passwordInput.type = showing ? 'password' : 'text';
      const eye = passwordToggle.querySelector('.icon-eye');
      const eyeOff = passwordToggle.querySelector('.icon-eye-off');
      if (eye) eye.hidden = !showing;
      if (eyeOff) eyeOff.hidden = showing;
      passwordToggle.setAttribute('aria-label', showing ? 'Mostrar password' : 'Ocultar password');
      passwordToggle.title = showing ? 'Mostrar password' : 'Ocultar password';
      passwordInput.focus();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pw = (passwordInput?.value || '').trim();
      const stored = localStorage.getItem('arc_admin_pw') || DEFAULT_ADMIN_PASSWORD;
      if (pw === stored) {
        setAuth($('#rememberMe')?.checked);
        loginError.textContent = '';
        showApp();
      } else {
        loginError.textContent = 'Password incorreta.';
      }
    });
  }
  $('#logoutBtn')?.addEventListener('click', () => {
    clearAuth();
    showLogin();
  });

  // ── Toast ───────────────────────────────────────────────────────────────
  function toast(msg, type = '') {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  // ── Load / Save drafts ──────────────────────────────────────────────────
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }
  function saveJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function loadAll() {
    const defP = window.DEFAULT_PRODUCTS || [];
    const defZ = window.DEFAULT_ZONES || [];
    const defT = window.DEFAULT_TEXTS || { pt: {}, en: {} };
    const defI = window.DEFAULT_SITE_IMAGES || {};

    const draftP = loadJSON(LS.products, null);
    // Prefer full default catalog when draft is missing the new product set
    const draftLooksLegacy = Array.isArray(draftP) && draftP.length > 0 &&
      !draftP.some((p) => p && p.id === 'short-boost');
    products = (!draftP || draftLooksLegacy)
      ? structuredClone(defP)
      : draftP;
    zones = loadJSON(LS.zones, null) || structuredClone(defZ);
    texts = loadJSON(LS.texts, null) || structuredClone(defT);
    images = loadJSON(LS.images, null) || structuredClone(defI);
    media = loadJSON(LS.media, []) || [];

    // Merge colours / sizes from defaults when draft is older (missing fields)
    if (Array.isArray(defP) && defP.length) {
      const byId = Object.fromEntries(defP.map((p) => [p.id, p]));
      products = products.map((p) => {
        const d = byId[p.id];
        if (!d) return { ...p, colors: Array.isArray(p.colors) ? p.colors : [] };
        const next = { ...p };
        if (!Array.isArray(next.colors) || next.colors.length === 0) {
          if (Array.isArray(d.colors) && d.colors.length) next.colors = [...d.colors];
          else next.colors = [];
        }
        if (!Array.isArray(next.sizes) || next.sizes.length === 0) {
          if (Array.isArray(d.sizes) && d.sizes.length) next.sizes = [...d.sizes];
        }
        // Keep staff images if already set
        if (!next.image && d.image) next.image = d.image;
        return next;
      });
    }
    normalizeOrders();
  }

  let undoSnapshot = null;

  function saveDraft(opts) {
    const silent = opts && opts.silent;
    try {
      undoSnapshot = {
        products: loadJSON(LS.products, null),
        zones: loadJSON(LS.zones, null),
        texts: loadJSON(LS.texts, null),
        images: loadJSON(LS.images, null),
        at: Date.now(),
      };
    } catch (_) {
      undoSnapshot = null;
    }
    saveJSON(LS.products, products);
    saveJSON(LS.zones, zones);
    saveJSON(LS.texts, texts);
    saveJSON(LS.images, images);
    saveJSON(LS.media, media);
    if (!silent) toast('Rascunho guardado neste browser', 'ok');
    updatePublishStrip();
    updateStats();
    const undoBtn = document.getElementById('btnUndoDraft');
    if (undoBtn) undoBtn.hidden = !undoSnapshot;
  }

  function undoDraft() {
    if (!undoSnapshot) {
      toast('Nada para desfazer', 'error');
      return;
    }
    if (undoSnapshot.products) products = undoSnapshot.products;
    if (undoSnapshot.zones) zones = undoSnapshot.zones;
    if (undoSnapshot.texts) texts = undoSnapshot.texts;
    if (undoSnapshot.images) images = undoSnapshot.images;
    saveJSON(LS.products, products);
    saveJSON(LS.zones, zones);
    saveJSON(LS.texts, texts);
    saveJSON(LS.images, images);
    undoSnapshot = null;
    const undoBtn = document.getElementById('btnUndoDraft');
    if (undoBtn) undoBtn.hidden = true;
    renderAll();
    toast('Rascunho anterior restaurado', 'ok');
    updatePublishStrip();
  }

  function catalogFingerprint(list) {
    return JSON.stringify(
      (list || []).map((p) => ({
        id: p.id,
        name_pt: p.name_pt,
        name_en: p.name_en,
        price: p.price,
        image: p.image,
        sizes: p.sizes,
        colors: p.colors,
        active: p.active !== false,
        order: p.order,
        category: p.category || '',
        soldOut: !!p.soldOut,
      }))
    );
  }

  function updatePublishStrip() {
    const text = document.getElementById('publishStripText');
    const dot = document.getElementById('publishDot');
    if (!text) return;
    const last = localStorage.getItem('arc_last_publish');
    let published = null;
    try {
      published = JSON.parse(localStorage.getItem('arc_catalog_published') || 'null');
    } catch (_) {}
    const liveProducts = published && Array.isArray(published.products) ? published.products : [];
    const dirty = catalogFingerprint(products) !== catalogFingerprint(liveProducts);
    const lastLabel = last
      ? new Date(last).toLocaleString('pt-AO', { dateStyle: 'short', timeStyle: 'short' })
      : 'nunca';
    if (dot) {
      dot.classList.toggle('is-dirty', dirty);
      dot.classList.toggle('is-clean', !dirty);
    }
    text.textContent = dirty
      ? 'Rascunho com alterações por publicar · Última publicação: ' + lastLabel
      : 'Loja sincronizada · Última publicação: ' + lastLabel;
  }


  // ── Nav ─────────────────────────────────────────────────────────────────
  $$('.admin-nav button').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.admin-nav button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const panel = btn.dataset.panel;
      $$('.panel').forEach((p) => p.classList.toggle('active', p.id === 'panel-' + panel));
    });
  });

  // ── Products ────────────────────────────────────────────────────────────
  let productFilter = { q: '', status: 'all', cat: 'all' };
  let selectedIds = new Set();
  let compactMode = localStorage.getItem('arc_admin_compact') === '1';

  const CAT_LABELS = {
    shorts: 'Shorts',
    conjuntos: 'Conjuntos',
    tops: 'Tops',
    bottoms: 'Calças & Leggings',
    outerwear: 'Casacos',
    acessorios: 'Acessórios',
    kids: 'Kids & Teens',
    outros: 'Outros',
  };

  function uid() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function slugify(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
  }

  function inferCategory(p) {
    if (p && p.category) return String(p.category).toLowerCase();
    const blob = [p && p.id, p && p.name_pt, p && p.name_en]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (/\b(kids|teens|infantil|crianc)/.test(blob)) return 'kids';
    if (/\b(short|shorts)\b/.test(blob)) return 'shorts';
    if (/\b(conjunto|set)\b/.test(blob) || /\bkit\b/.test(blob)) return 'conjuntos';
    if (/\b(legging|calca|macacao|fato|pants)\b/.test(blob)) return 'bottoms';
    if (/\b(jacket|casaco|pulover|hoodie|wind)\b/.test(blob)) return 'outerwear';
    if (/\b(t-?shirt|tshirt|blusa|top|cropped|regata|singlet|long sleeve|polo)\b/.test(blob)) return 'tops';
    if (/\b(cap|pala|visor|mala|meia|sock|shaker|garrafa|toalha|bottle|towel|acessor)\b/.test(blob))
      return 'acessorios';
    return 'outros';
  }

  function hasImage(p) {
    return !!(p && p.image && String(p.image).trim());
  }

  /** Force unique sequential order 1…n (stable by current order, then name). */
  function normalizeOrders() {
    const sorted = [...products].sort((a, b) => {
      const ao = a.order || 0;
      const bo = b.order || 0;
      if (ao !== bo) return ao - bo;
      const an = (a.name_pt || a.name_en || a.id || '').toLowerCase();
      const bn = (b.name_pt || b.name_en || b.id || '').toLowerCase();
      return an.localeCompare(bn, 'pt');
    });
    sorted.forEach((p, i) => {
      p.order = i + 1;
    });
    products = sorted;
  }


  function normalizeQ(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function filteredProducts() {
    const q = normalizeQ(productFilter.q).trim();
    return [...products]
      .map((p) => ({ ...p, _cat: p.category || inferCategory(p) }))
      .filter((p) => {
        if (q) {
          const blob = normalizeQ([p.id, p.name_pt, p.name_en, p.desc_pt].filter(Boolean).join(' '));
          if (!blob.includes(q)) return false;
        }
        if (productFilter.status === 'active' && p.active === false) return false;
        if (productFilter.status === 'inactive' && p.active !== false) return false;
        if (productFilter.status === 'noimage' && hasImage(p)) return false;
        if (productFilter.status === 'soldout' && !p.soldOut) return false;
        if (productFilter.cat !== 'all' && p._cat !== productFilter.cat) return false;
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  function fillCategoryFilter() {
    const sel = document.getElementById('productFilterCat');
    if (!sel) return;
    const cur = productFilter.cat;
    const counts = {};
    products.forEach((p) => {
      const c = p.category || inferCategory(p);
      counts[c] = (counts[c] || 0) + 1;
    });
    const keys = Object.keys(CAT_LABELS).filter((k) => counts[k]);
    sel.innerHTML =
      '<option value="all">Todas as categorias</option>' +
      keys
        .map((k) => '<option value="' + k + '"' + (cur === k ? ' selected' : '') + '>' + CAT_LABELS[k] + ' (' + counts[k] + ')</option>')
        .join('');
  }

  function updateBulkBar() {
    const bar = document.getElementById('bulkBar');
    const count = document.getElementById('bulkCount');
    const n = selectedIds.size;
    if (bar) {
      if (n === 0) {
        bar.hidden = true;
        bar.setAttribute('hidden', '');
      } else {
        bar.hidden = false;
        bar.removeAttribute('hidden');
      }
    }
    if (count) count.textContent = n + (n === 1 ? ' selecionado' : ' selecionados');
    const all = document.getElementById('selectAllProducts');
    if (all) {
      const vis = filteredProducts();
      all.checked = vis.length > 0 && vis.every((p) => selectedIds.has(p.id));
      all.indeterminate = n > 0 && !all.checked;
    }
  }

  function renderProducts() {
    const list = document.getElementById('productList');
    const tbody = document.getElementById('productTableBody');
    if (!list && !tbody) return;

    fillCategoryFilter();
    const sorted = filteredProducts();
    const countEl = document.getElementById('productFilterCount');
    if (countEl) {
      countEl.textContent =
        sorted.length === products.length
          ? sorted.length + ' produtos'
          : sorted.length + ' de ' + products.length;
    }

    document.body.classList.toggle('admin-compact', compactMode);

    if (list) {
      list.innerHTML =
        sorted
          .map((p) => {
            const noImg = !hasImage(p);
            const cat = p._cat || inferCategory(p);
            return (
              '<div class="product-card-admin ' +
              (p.active === false ? 'inactive ' : '') +
              (noImg ? 'no-image ' : '') +
              (p.soldOut ? 'sold-out ' : '') +
              '" data-id="' +
              esc(p.id) +
              '">' +
              '<label class="card-check"><input type="checkbox" data-select="' +
              esc(p.id) +
              '" ' +
              (selectedIds.has(p.id) ? 'checked' : '') +
              '></label>' +
              '<img src="' +
              esc(resolveImg(p.image)) +
              '" alt="" loading="lazy" onerror="this.src=\'images/logo.jpg\'">' +
              '<div class="meta"><h3>' +
              esc(p.name_pt || p.name_en || p.id) +
              (noImg ? ' <span class="tag tag-warn">Sem foto</span>' : '') +
              (p.soldOut ? ' <span class="tag tag-sold">Esgotado</span>' : '') +
              (p.active === false ? ' <span class="tag">Off</span>' : '') +
              '</h3><p>' +
              '#' +
              (p.order || '—') +
              ' · ' +
              formatKz(p.price) +
              ' · ' +
              esc(CAT_LABELS[cat] || cat) +
              ' · ' +
              ((p.sizes || []).join(', ') || '—') +
              ' · ' +
              ((p.colors || []).join(', ') || '—') +
              '</p></div><div class="actions">' +

              '<button type="button" class="btn btn-ghost btn-sm" data-move="' +
              esc(p.id) +
              '" data-dir="-1" title="Subir">↑</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-move="' +
              esc(p.id) +
              '" data-dir="1" title="Descer">↓</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-edit="' +
              esc(p.id) +
              '">Editar</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-dup="' +
              esc(p.id) +
              '">Dup.</button>' +
              '<button type="button" class="btn btn-danger btn-sm" data-del="' +
              esc(p.id) +
              '">Apagar</button></div></div>'
            );
          })
          .join('') || '<p style="color:var(--muted)">Nenhum produto neste filtro.</p>';

      list.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => openProductModal(b.dataset.edit)));
      list.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => deleteProduct(b.dataset.del)));
      list.querySelectorAll('[data-dup]').forEach((b) => b.addEventListener('click', () => duplicateProduct(b.dataset.dup)));
      list.querySelectorAll('[data-move]').forEach((b) =>
        b.addEventListener('click', () => moveProduct(b.dataset.move, parseInt(b.dataset.dir, 10)))
      );
      list.querySelectorAll('[data-select]').forEach((b) =>
        b.addEventListener('change', () => {
          if (b.checked) selectedIds.add(b.dataset.select);
          else selectedIds.delete(b.dataset.select);
          updateBulkBar();
        })
      );
    }

    if (tbody) {
      tbody.innerHTML = sorted
        .map((p) => {
          const noImg = !hasImage(p);
          const cat = p._cat || inferCategory(p);
          return (
            '<tr class="' +
            (p.active === false ? 'inactive ' : '') +
            (noImg ? 'no-image' : '') +
            '" data-id="' +
            esc(p.id) +
            '"><td class="col-check"><input type="checkbox" data-select="' +
            esc(p.id) +
            '" ' +
            (selectedIds.has(p.id) ? 'checked' : '') +
            '></td><td class="col-thumb"><img src="' +
            esc(resolveImg(p.image)) +
            '" alt="" onerror="this.src=\'images/logo.jpg\'">' +
            (noImg ? '<span class="tag tag-warn">Sem foto</span>' : '') +
            '</td><td>' +
            esc(p.name_pt || '') +
            '<br><span style="color:var(--muted);font-size:0.8em">' +
            esc(p.name_en || p.id || '') +
            '</span>' +
            (p.soldOut ? ' <span class="tag tag-sold">Esgotado</span>' : '') +
            '</td><td>' +
            esc(CAT_LABELS[cat] || cat) +
            '</td><td>' +
            formatKz(p.price) +
            '</td><td>' +
            ((p.sizes || []).join(', ') || '—') +
            '</td><td>' +
            ((p.colors || []).join(', ') || '—') +
            '</td><td>' +
            (p.active === false ? 'Off' : 'On') +
            '</td><td class="col-order"><button type="button" class="btn btn-ghost btn-sm" data-move="' +
            esc(p.id) +
            '" data-dir="-1">↑</button> <span>' +
            (p.order ?? '—') +
            '</span> <button type="button" class="btn btn-ghost btn-sm" data-move="' +
            esc(p.id) +
            '" data-dir="1">↓</button></td><td class="row-actions">' +
            '<button type="button" class="btn btn-ghost btn-sm" data-edit="' +
            esc(p.id) +
            '">Editar</button> ' +
            '<button type="button" class="btn btn-ghost btn-sm" data-dup="' +
            esc(p.id) +
            '">Dup.</button> ' +
            '<button type="button" class="btn btn-danger btn-sm" data-del="' +
            esc(p.id) +
            '">Apagar</button></td></tr>'
          );
        })
        .join('');
      tbody.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => openProductModal(b.dataset.edit)));
      tbody.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => deleteProduct(b.dataset.del)));
      tbody.querySelectorAll('[data-dup]').forEach((b) => b.addEventListener('click', () => duplicateProduct(b.dataset.dup)));
      tbody.querySelectorAll('[data-move]').forEach((b) =>
        b.addEventListener('click', () => moveProduct(b.dataset.move, parseInt(b.dataset.dir, 10)))
      );
      tbody.querySelectorAll('[data-select]').forEach((b) =>
        b.addEventListener('change', () => {
          if (b.checked) selectedIds.add(b.dataset.select);
          else selectedIds.delete(b.dataset.select);
          updateBulkBar();
        })
      );
    }
    updateBulkBar();
  }

  function moveProduct(id, dir) {
    normalizeOrders();
    const sorted = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= sorted.length) return;
    const tmp = sorted[idx];
    sorted[idx] = sorted[j];
    sorted[j] = tmp;
    sorted.forEach((p, i) => {
      p.order = i + 1;
    });
    products = sorted;
    renderProducts();
    updatePublishStrip();
  }

  function openProductModal(id) {
    editingId = id || null;
    const p = id ? products.find((x) => x.id === id) : null;
    document.getElementById('modalTitle').textContent = p ? 'Editar produto' : 'Novo produto';
    const fid = document.getElementById('f_id');
    fid.value = (p && p.id) || '';
    fid.disabled = !!p;
    const hint = document.getElementById('f_id_hint');
    if (hint)
      hint.textContent = p
        ? 'ID bloqueado. Usa «Duplicar» para criar uma cópia com novo ID.'
        : 'Só editável em produtos novos. Usa letras, números e hífen.';
    const dupBtn = document.getElementById('btnDupProduct');
    if (dupBtn) dupBtn.hidden = !p;
    document.getElementById('f_name_pt').value = (p && p.name_pt) || '';
    document.getElementById('f_name_en').value = (p && p.name_en) || '';
    document.getElementById('f_desc_pt').value = (p && p.desc_pt) || '';
    document.getElementById('f_desc_en').value = (p && p.desc_en) || '';
    document.getElementById('f_price').value = p && p.price != null ? p.price : '';
    document.getElementById('f_sizes').value = ((p && p.sizes) || []).join(', ');
    document.getElementById('f_colors').value = ((p && p.colors) || []).join(', ');
    document.getElementById('f_order').value = (p && p.order) || products.length + 1;
    document.getElementById('f_active').checked = p ? p.active !== false : true;
    const sold = document.getElementById('f_soldout');
    if (sold) sold.checked = !!(p && p.soldOut);
    const cat = document.getElementById('f_category');
    if (cat) cat.value = (p && p.category) || '';
    const img = (p && p.image) || '';
    document.getElementById('f_image').value = img;
    document.getElementById('f_image_preview').src = resolveImg(img) || 'images/logo.jpg';
    openModal('productModal');
  }

  function saveProductFromForm() {
    let id = (document.getElementById('f_id').value || '').trim();
    const namePt = (document.getElementById('f_name_pt').value || '').trim();
    if (!editingId) {
      if (!id) id = slugify(namePt) || uid();
      id = slugify(id) || uid();
      if (products.some((p) => p.id === id)) {
        toast('Já existe um produto com este ID', 'error');
        return;
      }
    } else {
      id = editingId;
    }
    if (!namePt && !(document.getElementById('f_name_en').value || '').trim()) {
      toast('Indica pelo menos o nome PT ou EN', 'error');
      return;
    }
    const price = parseInt(String(document.getElementById('f_price').value).replace(/\D/g, ''), 10) || 0;
    const sizes = (document.getElementById('f_sizes').value || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = (document.getElementById('f_colors').value || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const catEl = document.getElementById('f_category');
    const catVal = (catEl && catEl.value) || '';
    const soldEl = document.getElementById('f_soldout');
    const data = {
      id: id,
      name_pt: namePt,
      name_en: (document.getElementById('f_name_en').value || '').trim(),
      desc_pt: (document.getElementById('f_desc_pt').value || '').trim(),
      desc_en: (document.getElementById('f_desc_en').value || '').trim(),
      price: price,
      image: (document.getElementById('f_image').value || '').trim(),
      sizes: sizes.length ? sizes : ['Único'],
      colors: colors,
      active: document.getElementById('f_active').checked,
      soldOut: !!(soldEl && soldEl.checked),
      category: catVal || undefined,
      order: parseInt(document.getElementById('f_order').value, 10) || 0,
    };
    const idx = products.findIndex((x) => x.id === id);
    if (idx >= 0) products[idx] = Object.assign({}, products[idx], data);
    else products.push(data);

    // Place product at requested order and renumber 1…n (true swap / insert)
    const desired = Math.max(1, parseInt(data.order, 10) || products.length);
    normalizeOrders();
    const sorted = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));
    const from = sorted.findIndex((x) => x.id === id);
    if (from >= 0) {
      const [item] = sorted.splice(from, 1);
      const to = Math.min(Math.max(desired - 1, 0), sorted.length);
      sorted.splice(to, 0, item);
      sorted.forEach((p, i) => {
        p.order = i + 1;
      });
      products = sorted;
    }

    closeModal('productModal');
    renderProducts();
    updateStats();
    updatePublishStrip();
    toast('Produto atualizado (rascunho)', 'ok');
  }

  function deleteProduct(id) {
    if (!confirm('Apagar este produto do rascunho?')) return;
    products = products.filter((x) => x.id !== id);
    selectedIds.delete(id);
    renderProducts();
    updateStats();
    updatePublishStrip();
    toast('Produto removido do rascunho');
  }

  function duplicateProduct(id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    let base = slugify(p.id + '-copia') || uid();
    let n = 2;
    let newId = base;
    while (products.some((x) => x.id === newId)) {
      newId = base + '-' + n++;
    }
    const maxOrder = products.reduce((m, x) => Math.max(m, x.order || 0), 0);
    const copy = Object.assign({}, JSON.parse(JSON.stringify(p)), {
      id: newId,
      name_pt: (p.name_pt || '') + ' (cópia)',
      name_en: (p.name_en || '') + (p.name_en ? ' (copy)' : ''),
      order: maxOrder + 1,
      active: false,
    });
    products.push(copy);
    renderProducts();
    updatePublishStrip();
    openProductModal(newId);
    toast('Cópia criada — edita e ativa quando estiver pronta', 'ok');
  }

  function applyBulk(action) {
    if (!selectedIds.size && action !== 'clear') return;
    if (action === 'clear') {
      selectedIds.clear();
      renderProducts();
      return;
    }
    products.forEach((p) => {
      if (!selectedIds.has(p.id)) return;
      if (action === 'activate') p.active = true;
      if (action === 'deactivate') p.active = false;
      if (action === 'soldout') p.soldOut = true;
      if (action === 'unsoldout') p.soldOut = false;
    });
    const catSel = document.getElementById('bulkCategory');
    if (action === 'category' && catSel && catSel.value) {
      products.forEach((p) => {
        if (selectedIds.has(p.id)) p.category = catSel.value;
      });
    }
    renderProducts();
    updatePublishStrip();
    toast('Atualizado em lote (rascunho)', 'ok');
  }

  function exportCsv() {
    const rows = [['id', 'name_pt', 'name_en', 'price', 'sizes', 'colors', 'category', 'active', 'soldOut', 'order', 'image']];
    [...products]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .forEach((p) => {
        rows.push([
          p.id,
          p.name_pt || '',
          p.name_en || '',
          p.price || 0,
          (p.sizes || []).join('|'),
          (p.colors || []).join('|'),
          p.category || inferCategory(p),
          p.active === false ? '0' : '1',
          p.soldOut ? '1' : '0',
          p.order || 0,
          p.image || '',
        ]);
      });
    const csv = rows
      .map((r) =>
        r
          .map((c) => {
            const s = String(c);
            return /["\n,]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
          })
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'attitude-products.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('CSV exportado', 'ok');
  }

  document.getElementById('btnAddProduct')?.addEventListener('click', () => openProductModal(null));
  document.getElementById('btnSaveProduct')?.addEventListener('click', saveProductFromForm);
  document.getElementById('btnDupProduct')?.addEventListener('click', () => {
    if (editingId) {
      closeModal('productModal');
      duplicateProduct(editingId);
    }
  });
  document.getElementById('btnCopyId')?.addEventListener('click', async () => {
    const v = (document.getElementById('f_id') && document.getElementById('f_id').value) || '';
    if (!v) return;
    try {
      await navigator.clipboard.writeText(v);
      toast('ID copiado', 'ok');
    } catch (_) {
      toast(v, 'ok');
    }
  });
  document.getElementById('btnExportCsv')?.addEventListener('click', exportCsv);
  document.getElementById('btnDensity')?.addEventListener('click', () => {
    compactMode = !compactMode;
    localStorage.setItem('arc_admin_compact', compactMode ? '1' : '0');
    renderProducts();
  });
  document.getElementById('btnUndoDraft')?.addEventListener('click', undoDraft);

  let searchTimer;
  document.getElementById('productSearch')?.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      productFilter.q = e.target.value || '';
      renderProducts();
    }, 150);
  });
  document.getElementById('productFilterStatus')?.addEventListener('change', (e) => {
    productFilter.status = e.target.value || 'all';
    renderProducts();
  });
  document.getElementById('productFilterCat')?.addEventListener('change', (e) => {
    productFilter.cat = e.target.value || 'all';
    renderProducts();
  });
  document.getElementById('selectAllProducts')?.addEventListener('change', (e) => {
    const vis = filteredProducts();
    if (e.target.checked) vis.forEach((p) => selectedIds.add(p.id));
    else vis.forEach((p) => selectedIds.delete(p.id));
    renderProducts();
  });
  document.querySelectorAll('#bulkBar [data-bulk]').forEach((btn) => {
    btn.addEventListener('click', () => applyBulk(btn.dataset.bulk));
  });
  document.getElementById('bulkCategory')?.addEventListener('change', (e) => {
    if (e.target.value) applyBulk('category');
    e.target.value = '';
  });


  // ── Zones ───────────────────────────────────────────────────────────────
  function renderZones() {
    const el = $('#zoneList');
    if (!el) return;
    el.innerHTML = zones.map((z, i) => `
      <div class="zone-row" data-i="${i}">
        <input type="text" value="${esc(z.name || '')}" data-field="name" placeholder="Zona" aria-label="Nome da zona">
        <input type="number" inputmode="decimal" value="${z.price ?? 0}" data-field="price" placeholder="0" aria-label="Preço">
        <button type="button" class="btn btn-danger btn-sm" data-del-zone="${i}">✕</button>
      </div>
    `).join('') || '<p style="color:var(--muted)">Sem zonas. Opcional para entrega.</p>';

    el.querySelectorAll('.zone-row').forEach((row) => {
      const i = parseInt(row.dataset.i, 10);
      row.querySelectorAll('input').forEach((inp) => {
        inp.addEventListener('change', () => {
          if (inp.dataset.field === 'name') zones[i].name = inp.value;
          if (inp.dataset.field === 'price') zones[i].price = parseInt(inp.value, 10) || 0;
        });
      });
      row.querySelector('[data-del-zone]')?.addEventListener('click', () => {
        zones.splice(i, 1);
        renderZones();
        updateStats();
      });
    });
  }
  $('#btnAddZone')?.addEventListener('click', () => {
    zones.push({ id: 'z_' + Date.now(), name: '', price: 0 });
    renderZones();
  });

  // ── Texts ───────────────────────────────────────────────────────────────
  function renderTexts() {
    const keys = [
      { k: 'hero.title1', label: 'Hero título linha 1' },
      { k: 'hero.title2', label: 'Hero título linha 2 (itálico)' },
      { k: 'hero.sub', label: 'Hero subtítulo' },
      { k: 'loja.title', label: 'Loja título' },
      { k: 'loja.sub', label: 'Loja subtítulo' },
    ];
    const el = $('#textsGrid');
    if (!el) return;
    if (!texts.pt) texts.pt = {};
    if (!texts.en) texts.en = {};
    el.innerHTML = keys.map(({ k, label }) => `
      <div class="text-block" data-key="${esc(k)}">
        <h3>${esc(label)} <code style="font-weight:400;color:var(--muted)">${esc(k)}</code></h3>
        <div class="field">
          <label>PT</label>
          <textarea data-lang="pt" rows="2">${esc(texts.pt[k] || '')}</textarea>
        </div>
        <div class="field">
          <label>EN</label>
          <textarea data-lang="en" rows="2">${esc(texts.en[k] || '')}</textarea>
        </div>
      </div>
    `).join('');
    el.querySelectorAll('textarea').forEach((ta) => {
      ta.addEventListener('change', () => {
        const key = ta.closest('[data-key]')?.dataset.key;
        const lang = ta.dataset.lang;
        if (key && lang) {
          if (!texts[lang]) texts[lang] = {};
          texts[lang][key] = ta.value;
        }
      });
    });
  }

  // ── Site images ─────────────────────────────────────────────────────────
  function renderSlots() {
    const slots = window.SITE_IMAGE_SLOTS || [];
    const el = $('#slotsGrid');
    if (!el) return;
    el.innerHTML = slots.map((s) => {
      const url = images[s.key] || (window.DEFAULT_SITE_IMAGES || {})[s.key] || '';
      return `
        <div class="slot-card" data-slot="${esc(s.key)}">
          <h3>${esc(s.label)}</h3>
          <div class="hint">${esc(s.hint || '')}</div>
          <img class="slot-preview" src="${esc(resolveImg(url) || 'images/logo.jpg')}" alt="" onerror="this.src='images/logo.jpg'">
          <div class="slot-actions">
            <button type="button" class="btn btn-ghost btn-sm" data-slot-upload="${esc(s.key)}">Carregar</button>
            <button type="button" class="btn btn-ghost btn-sm" data-slot-pick="${esc(s.key)}">Escolher da média</button>
            <button type="button" class="btn btn-ghost btn-sm" data-slot-reset="${esc(s.key)}">Original</button>
          </div>
        </div>
      `;
    }).join('');

    el.querySelectorAll('[data-slot-upload]').forEach((b) => {
      b.addEventListener('click', () => {
        pickerTarget = { type: 'slot', key: b.dataset.slotUpload };
        $('#mediaFileInput')?.click();
      });
    });
    el.querySelectorAll('[data-slot-pick]').forEach((b) => {
      b.addEventListener('click', () => openMediaPicker('slot', b.dataset.slotPick));
    });
    el.querySelectorAll('[data-slot-reset]').forEach((b) => {
      b.addEventListener('click', () => {
        const key = b.dataset.slotReset;
        delete images[key];
        renderSlots();
        toast('Slot reposto ao original');
      });
    });
  }

  // ── Media library ───────────────────────────────────────────────────────
  function renderMedia() {
    const el = $('#mediaGrid');
    if (!el) return;
    el.innerHTML = media.map((m, i) => `
      <div class="media-item" data-i="${i}">
        <img src="${esc(m.url)}" alt="" loading="lazy">
        <div class="media-actions">
          <button type="button" data-copy="${i}">URL</button>
          <button type="button" data-rm="${i}">✕</button>
        </div>
      </div>
    `).join('') || '<p style="color:var(--muted);grid-column:1/-1">Biblioteca vazia. Faz upload acima.</p>';

    el.querySelectorAll('[data-copy]').forEach((b) => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const url = media[parseInt(b.dataset.copy, 10)]?.url;
        if (url) {
          try { await navigator.clipboard.writeText(url); toast('URL copiada', 'ok'); }
          catch { toast(url); }
        }
      });
    });
    el.querySelectorAll('[data-rm]').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        media.splice(parseInt(b.dataset.rm, 10), 1);
        saveJSON(LS.media, media);
        renderMedia();
        toast('Removido da biblioteca (ficheiro Cloudinary mantém-se)');
      });
    });
  }

  async function uploadToCloudinary(file) {
    const cloud = window.CLOUDINARY_CLOUD_NAME || '';
    const preset = window.CLOUDINARY_UPLOAD_PRESET || '';
    const folder = window.CLOUDINARY_FOLDER || 'attitude-run-club';
    if (!cloud || !preset) {
      toast('Configura CLOUDINARY_CLOUD_NAME e UPLOAD_PRESET em products.js', 'error');
      return null;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', preset);
    fd.append('folder', folder + '/media');
    toast('A enviar…');
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
      return data.secure_url || data.url;
    } catch (err) {
      toast('Upload falhou: ' + (err.message || err), 'error');
      return null;
    }
  }

  $('#mediaFileInput')?.addEventListener('change', async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      if (!url) continue;
      media.unshift({ url, at: new Date().toISOString() });
      saveJSON(LS.media, media);
      if (pickerTarget?.type === 'product') {
        $('#f_image').value = url;
        $('#f_image_preview').src = url;
      } else if (pickerTarget?.type === 'slot' && pickerTarget.key) {
        images[pickerTarget.key] = url;
        renderSlots();
      }
      pickerTarget = null;
    }
    renderMedia();
    if (files.length) toast('Upload concluído', 'ok');
  });

  const uploadZone = $('#uploadZone');
  if (uploadZone) {
    uploadZone.addEventListener('click', () => $('#mediaFileInput')?.click());
    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
    uploadZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const files = [...(e.dataTransfer?.files || [])].filter((f) => f.type.startsWith('image/'));
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) {
          media.unshift({ url, at: new Date().toISOString() });
          saveJSON(LS.media, media);
        }
      }
      renderMedia();
    });
  }

  function openMediaPicker(type, key) {
    pickerTarget = type === 'slot' ? { type: 'slot', key } : { type: 'product' };
    const grid = $('#pickerGrid');
    if (grid) {
      grid.innerHTML = media.map((m, i) => `
        <div class="media-item" data-pick="${i}">
          <img src="${esc(m.url)}" alt="">
        </div>
      `).join('') || '<p style="color:var(--muted)">Biblioteca vazia.</p>';
      grid.querySelectorAll('[data-pick]').forEach((el) => {
        el.addEventListener('click', () => {
          const url = media[parseInt(el.dataset.pick, 10)]?.url;
          if (!url) return;
          if (pickerTarget?.type === 'product') {
            $('#f_image').value = url;
            $('#f_image_preview').src = url;
          } else if (pickerTarget?.type === 'slot' && pickerTarget.key) {
            images[pickerTarget.key] = url;
            renderSlots();
          }
          closeModal('pickerModal');
          pickerTarget = null;
          toast('Imagem atribuída', 'ok');
        });
      });
    }
    openModal('pickerModal');
  }


  document.getElementById('btnUploadProductImage')?.addEventListener('click', () => {
    pickerTarget = { type: 'product' };
    document.getElementById('mediaFileInput')?.click();
  });
  document.getElementById('btnPickProductImage')?.addEventListener('click', () => {
    openMediaPicker('product');
  });

  // ── Publish ─────────────────────────────────────────────────────────────
  function buildCatalog() {
    return {
      updatedAt: new Date().toISOString(),
      products: products.filter((p) => p.active !== false),
      zones,
      texts,
      images,
    };
  }

  async function publish() {
    const catalog = buildCatalog();
    const n = catalog.products.length;
    const z = catalog.zones.length;
    const missingName = products.filter((p) => !((p.name_pt || p.name_en || '').trim()));
    const missingPrice = products.filter((p) => p.active !== false && !(Number(p.price) > 0));
    const noImg = products.filter((p) => p.active !== false && !hasImage(p));
    if (missingName.length) {
      toast(missingName.length + ' produto(s) sem nome — corrige antes de publicar', 'error');
      return;
    }
    let okGo = true;
    if (missingPrice.length) {
      okGo = confirm(missingPrice.length + ' produto(s) ativos com preço 0. Publicar na mesma?');
    } else if (noImg.length) {
      okGo = confirm(noImg.length + ' produto(s) ativos sem foto. Publicar na mesma?\n\n• ' + n + ' produtos\n• ' + z + ' zonas');
    } else {
      okGo = confirm('Publicar na loja?\n\n• ' + n + ' produtos\n• ' + z + ' zonas\n• textos + imagens do site\n\nTodos os visitantes verão estas alterações no próximo carregamento.');
    }
    if (!okGo) return;

    // Always save draft first
    saveJSON(LS.products, products);
    saveJSON(LS.zones, zones);
    saveJSON(LS.texts, texts);
    saveJSON(LS.images, images);

    const password = sessionStorage.getItem('arc_publish_pw') || localStorage.getItem('arc_admin_pw') || DEFAULT_ADMIN_PASSWORD;

    // Fallback: local signed path if no Worker URL (desktop only — not for shared phones)
    if (!PUBLISH_URL) {
      // Store catalog in localStorage as "published" preview for this browser
      localStorage.setItem('arc_catalog_published', JSON.stringify(catalog));
      toast('Sem PUBLISH_URL — catálogo guardado só neste browser. Configura o Worker.', 'error');
      updateStats();
      return;
    }

    toast('A publicar…');
    try {
      const res = await fetch(PUBLISH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, catalog }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || ('HTTP ' + res.status));
      }
      localStorage.setItem('arc_catalog_published', JSON.stringify(catalog));
      localStorage.setItem('arc_last_publish', data.updatedAt || catalog.updatedAt);
      toast('Publicado com sucesso', 'ok');
      updateStats();
      updatePublishStrip();
    } catch (err) {
      toast('Publicar falhou: ' + (err.message || err), 'error');
    }
  }

  $('#btnSaveDraft')?.addEventListener('click', saveDraft);
  $('#btnPublish')?.addEventListener('click', publish);

  // Change password (simple)
  $('#btnChangePw')?.addEventListener('click', () => {
    const next = prompt('Nova password de admin:');
    if (!next || next.length < 4) return;
    localStorage.setItem('arc_admin_pw', next);
    toast('Password atualizada neste browser', 'ok');
  });

  // ── Modal helpers ───────────────────────────────────────────────────────
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('open');
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('open');
  }
  $$('[data-close-modal]').forEach((b) => {
    b.addEventListener('click', () => closeModal(b.dataset.closeModal));
  });
  $$('.modal-backdrop').forEach((bd) => {
    bd.addEventListener('click', (e) => {
      if (e.target === bd) bd.classList.remove('open');
    });
  });

  // ── Utils ───────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function formatKz(n) {
    return (Number(n) || 0).toLocaleString('pt-AO') + ' Kz';
  }
  function resolveImg(src) {
    if (!src) return '';
    if (/^https?:\/\//i.test(src)) return src;
    // Admin is at /admin.html — relative paths need no ../ for images/
    if (src.startsWith('images/')) return src;
    if (src.startsWith('../images/')) return src.replace('../', '');
    return src;
  }

  // ── Inbox (pedidos & contactos) ─────────────────────────────────────────
  async function loadInbox() {
    const list = $('#inboxList');
    if (list) list.innerHTML = '<p class="inbox-empty">A carregar…</p>';
    updateStats({ inboxLoading: true });
    try {
      const res = await fetch(INBOX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword(), action: 'list' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Falha ao carregar');
      }
      inboxItems = Array.isArray(data.items) ? data.items : [];
      renderInbox();
      updateStats();
    } catch (err) {
      if (list) {
        list.innerHTML = '<p class="inbox-empty">Não foi possível carregar o inbox. Confirma que o Worker está publicado com /inbox.</p>';
      }
      // Keep last known count if any; otherwise show 0 without loading state
      updateStats();
      toast('Inbox: ' + (err.message || err), 'error');
    }
  }

  function filteredInbox() {
    return inboxItems.filter((it) => {
      if (inboxFilter === 'all') return true;
      if (inboxFilter === 'new') return it.status === 'new';
      if (inboxFilter === 'done') return it.status === 'done';
      if (inboxFilter === 'order') return it.type === 'order';
      if (inboxFilter === 'contact') return it.type === 'contact';
      return true;
    });
  }

  function renderInbox() {
    const list = $('#inboxList');
    if (!list) return;
    const items = filteredInbox();
    if (!items.length) {
      list.innerHTML = '<p class="inbox-empty">Nenhum pedido ou contacto' +
        (inboxFilter !== 'all' ? ' neste filtro' : '') + '.</p>';
      return;
    }
    list.innerHTML = items.map((it) => {
      const isOrder = it.type === 'order';
      const status = it.status || 'new';
      const date = it.createdAt ? new Date(it.createdAt).toLocaleString('pt-AO') : '—';
      const meta = [];
      if (it.email) meta.push(`<a href="mailto:${esc(it.email)}">${esc(it.email)}</a>`);
      if (it.phone) meta.push(`<a href="https://wa.me/${esc(String(it.phone).replace(/\D/g, ''))}" target="_blank" rel="noopener">${esc(it.phone)}</a>`);
      if (it.city) meta.push(esc(it.city));
      const itemsHtml = isOrder && Array.isArray(it.items) && it.items.length
        ? '<ul class="inbox-items">' + it.items.map((line) =>
            `<li>${esc(line.name || '')} · ${esc(line.size || '—')}${line.color ? ' · ' + esc(line.color) : ''} · x${line.qty || 1} · ${formatKz(line.price * (line.qty || 1))}</li>`
          ).join('') + '</ul>' +
          (it.total ? `<p class="inbox-meta"><strong>Total estimado: ${formatKz(it.total)}</strong></p>` : '')
        : '';
      const msg = it.message || it.notes || '';
      return `
        <article class="inbox-card ${status === 'new' ? 'is-new' : ''}" data-id="${esc(it.id)}">
          <div class="inbox-card-top">
            <span class="inbox-type ${isOrder ? 'order' : 'contact'}">${isOrder ? 'Encomenda' : 'Contacto'}</span>
            <span class="inbox-status ${esc(status)}">${status === 'new' ? 'Novo' : status === 'done' ? 'Concluído' : 'Lido'}</span>
            <span class="inbox-date">${esc(date)}</span>
          </div>
          <p class="inbox-name">${esc(it.name || '—')}</p>
          ${meta.length ? `<p class="inbox-meta">${meta.join(' · ')}</p>` : ''}
          ${msg ? `<p class="inbox-msg">${esc(msg)}</p>` : ''}
          ${itemsHtml}
          <div class="inbox-actions">
            ${status !== 'read' && status !== 'done' ? `<button type="button" class="btn btn-ghost btn-sm" data-inbox-status="read" data-id="${esc(it.id)}">Marcar lido</button>` : ''}
            ${status !== 'done' ? `<button type="button" class="btn btn-ghost btn-sm" data-inbox-status="done" data-id="${esc(it.id)}">Concluir</button>` : ''}
            ${status === 'done' ? `<button type="button" class="btn btn-ghost btn-sm" data-inbox-status="new" data-id="${esc(it.id)}">Reabrir</button>` : ''}
            ${it.phone ? `<a class="btn btn-primary btn-sm" href="https://wa.me/${esc(String(it.phone).replace(/\D/g, ''))}?text=${encodeURIComponent('Olá ' + (it.name || '') + ', falamos da Attitude Run Club.')}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
            <button type="button" class="btn btn-ghost btn-sm" data-inbox-delete data-id="${esc(it.id)}">Apagar</button>
          </div>
        </article>`;
    }).join('');
  }

  async function inboxSetStatus(id, status) {
    try {
      const res = await fetch(INBOX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword(), action: 'setStatus', id, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha');
      const row = inboxItems.find((x) => x.id === id);
      if (row) row.status = status;
      renderInbox();
      updateStats();
      toast('Atualizado', 'ok');
    } catch (err) {
      toast(err.message || String(err), 'error');
    }
  }

  async function inboxDelete(id) {
    if (!confirm('Apagar este registo?')) return;
    try {
      const res = await fetch(INBOX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword(), action: 'delete', id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha');
      inboxItems = inboxItems.filter((x) => x.id !== id);
      renderInbox();
      updateStats();
      toast('Apagado', 'ok');
    } catch (err) {
      toast(err.message || String(err), 'error');
    }
  }

  $('#btnRefreshInbox')?.addEventListener('click', () => loadInbox());
  $$('#inboxFilters .chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#inboxFilters .chip').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      inboxFilter = btn.dataset.filter || 'all';
      renderInbox();
    });
  });
  $('#inboxList')?.addEventListener('click', (e) => {
    const t = e.target.closest('[data-inbox-status], [data-inbox-delete]');
    if (!t) return;
    const id = t.dataset.id;
    if (!id) return;
    if (t.hasAttribute('data-inbox-delete')) inboxDelete(id);
    else if (t.dataset.inboxStatus) inboxSetStatus(id, t.dataset.inboxStatus);
  });

  // Load inbox when opening Pedidos tab
  $$('.admin-nav button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.panel === 'inbox') loadInbox();
    });
  });

  function updateStats(opts = {}) {
    const set = (id, v, loading) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = v;
      el.classList.toggle('is-loading', !!loading);
    };
    set('statProducts', products.filter((p) => p.active !== false).length);
    set('statZones', zones.length);
    set('statMedia', media.length);
    const newCount = inboxItems.filter((x) => x.status === 'new').length;
    if (opts.inboxLoading) {
      set('statInbox', '…', true);
    } else {
      set('statInbox', newCount);
    }
    const badge = document.getElementById('navInboxBadge');
    if (badge) {
      if (newCount > 0 && !opts.inboxLoading) {
        badge.hidden = false;
        badge.textContent = String(newCount);
      } else if (!opts.inboxLoading) {
        badge.hidden = true;
      }
    }
    const last = localStorage.getItem('arc_last_publish');
    set('statPublish', last ? new Date(last).toLocaleString('pt-AO') : '—');
    if (typeof updatePublishStrip === 'function') updatePublishStrip();
  }

  function renderAll() {
    renderProducts();
    renderZones();
    renderTexts();
    renderSlots();
    renderMedia();
    // Local stats first (no zero flash), inbox shows loading until fetch returns
    updateStats({ inboxLoading: true });
    loadInbox();
  }

  // ── Keyboard ────────────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach((m) => m.classList.remove('open'));
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (isAuthed()) saveDraft();
    }
  });

  // ── Boot ────────────────────────────────────────────────────────────────
  if (isAuthed()) showApp();
  else showLogin();
})();
