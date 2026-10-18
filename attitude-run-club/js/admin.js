/**
 * Attitude Run Club — Admin panel logic
 * Drafts in localStorage · Publish via Worker → Cloudinary catalog.json
 */
(function () {
  'use strict';

  // ── Config (override after deploy) ──────────────────────────────────────
  const PUBLISH_URL = 'https://attitude-run-club-publish.workersdevao.workers.dev/publish';
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
  let editingId = null;
  let pickerTarget = null; // { type: 'product'|'slot', id/key }

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
    if (loginScreen) loginScreen.hidden = true;
    if (adminApp) adminApp.hidden = false;
    document.body.classList.remove('no-sticky-pad');
    loadAll();
    renderAll();
  }
  function showLogin() {
    if (loginScreen) loginScreen.hidden = false;
    if (adminApp) adminApp.hidden = true;
    document.body.classList.add('no-sticky-pad');
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

    products = loadJSON(LS.products, null) || structuredClone(defP);
    zones = loadJSON(LS.zones, null) || structuredClone(defZ);
    texts = loadJSON(LS.texts, null) || structuredClone(defT);
    images = loadJSON(LS.images, null) || structuredClone(defI);
    media = loadJSON(LS.media, []) || [];
  }

  function saveDraft() {
    saveJSON(LS.products, products);
    saveJSON(LS.zones, zones);
    saveJSON(LS.texts, texts);
    saveJSON(LS.images, images);
    saveJSON(LS.media, media);
    toast('Rascunho guardado neste browser', 'ok');
    updateStats();
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
  function uid() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function renderProducts() {
    const list = $('#productList');
    const tbody = $('#productTableBody');
    if (!list && !tbody) return;

    const sorted = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));

    if (list) {
      list.innerHTML = sorted.map((p) => `
        <div class="product-card-admin ${p.active === false ? 'inactive' : ''}" data-id="${esc(p.id)}">
          <img src="${esc(resolveImg(p.image))}" alt="" loading="lazy" onerror="this.src='images/logo.jpg'">
          <div class="meta">
            <h3>${esc(p.name_pt || p.name_en || p.id)}</h3>
            <p>${formatKz(p.price)} · ${(p.sizes || []).join(', ') || '—'}</p>
          </div>
          <div class="actions">
            <button type="button" class="btn btn-ghost btn-sm" data-edit="${esc(p.id)}">Editar</button>
            <button type="button" class="btn btn-danger btn-sm" data-del="${esc(p.id)}">Apagar</button>
          </div>
        </div>
      `).join('') || '<p style="color:var(--muted)">Nenhum produto. Adiciona o primeiro.</p>';

      list.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => openProductModal(b.dataset.edit)));
      list.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => deleteProduct(b.dataset.del)));
    }

    if (tbody) {
      tbody.innerHTML = sorted.map((p) => `
        <tr class="${p.active === false ? 'inactive' : ''}">
          <td><img src="${esc(resolveImg(p.image))}" alt="" onerror="this.src='images/logo.jpg'"></td>
          <td>${esc(p.name_pt || '')}<br><span style="color:var(--muted);font-size:0.8em">${esc(p.name_en || '')}</span></td>
          <td>${formatKz(p.price)}</td>
          <td>${(p.sizes || []).join(', ')}</td>
          <td>${p.active === false ? 'Off' : 'On'}</td>
          <td class="row-actions">
            <button type="button" class="btn btn-ghost btn-sm" data-edit="${esc(p.id)}">Editar</button>
            <button type="button" class="btn btn-danger btn-sm" data-del="${esc(p.id)}">Apagar</button>
          </td>
        </tr>
      `).join('');
      tbody.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => openProductModal(b.dataset.edit)));
      tbody.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => deleteProduct(b.dataset.del)));
    }
  }

  function openProductModal(id) {
    editingId = id || null;
    const p = id ? products.find((x) => x.id === id) : null;
    $('#modalTitle').textContent = p ? 'Editar produto' : 'Novo produto';
    $('#f_id').value = p?.id || '';
    $('#f_id').disabled = !!p;
    $('#f_name_pt').value = p?.name_pt || '';
    $('#f_name_en').value = p?.name_en || '';
    $('#f_desc_pt').value = p?.desc_pt || '';
    $('#f_desc_en').value = p?.desc_en || '';
    $('#f_price').value = p?.price ?? '';
    $('#f_sizes').value = (p?.sizes || ['S', 'M', 'L', 'XL']).join(', ');
    $('#f_order').value = p?.order ?? products.length + 1;
    $('#f_active').checked = p ? p.active !== false : true;
    const img = p?.image || '';
    $('#f_image').value = img;
    $('#f_image_preview').src = resolveImg(img) || 'images/logo.jpg';
    openModal('productModal');
  }

  function saveProductFromForm() {
    const id = ($('#f_id').value || '').trim() || uid();
    const price = parseInt(String($('#f_price').value).replace(/\D/g, ''), 10) || 0;
    const sizes = ($('#f_sizes').value || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const data = {
      id,
      name_pt: ($('#f_name_pt').value || '').trim(),
      name_en: ($('#f_name_en').value || '').trim(),
      desc_pt: ($('#f_desc_pt').value || '').trim(),
      desc_en: ($('#f_desc_en').value || '').trim(),
      price,
      image: ($('#f_image').value || '').trim(),
      sizes: sizes.length ? sizes : ['Único'],
      active: $('#f_active').checked,
      order: parseInt($('#f_order').value, 10) || 0,
    };
    const idx = products.findIndex((x) => x.id === id);
    if (idx >= 0) products[idx] = data;
    else products.push(data);
    closeModal('productModal');
    renderProducts();
    updateStats();
    toast('Produto atualizado (rascunho)', 'ok');
  }

  function deleteProduct(id) {
    if (!confirm('Apagar este produto do rascunho?')) return;
    products = products.filter((x) => x.id !== id);
    renderProducts();
    updateStats();
    toast('Produto removido do rascunho');
  }

  $('#btnAddProduct')?.addEventListener('click', () => openProductModal(null));
  $('#btnSaveProduct')?.addEventListener('click', saveProductFromForm);
  $('#btnPickProductImage')?.addEventListener('click', () => openMediaPicker('product'));
  $('#btnUploadProductImage')?.addEventListener('click', () => {
    pickerTarget = { type: 'product' };
    $('#mediaFileInput')?.click();
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
    if (!confirm(`Publicar na loja?\n\n• ${n} produtos\n• ${z} zonas\n• textos + imagens do site\n\nTodos os visitantes verão estas alterações no próximo carregamento.`)) {
      return;
    }

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

  function updateStats() {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('statProducts', products.filter((p) => p.active !== false).length);
    set('statZones', zones.length);
    set('statMedia', media.length);
    const last = localStorage.getItem('arc_last_publish');
    set('statPublish', last ? new Date(last).toLocaleString('pt-AO') : '—');
  }

  function renderAll() {
    renderProducts();
    renderZones();
    renderTexts();
    renderSlots();
    renderMedia();
    updateStats();
  }

  // ── Boot ────────────────────────────────────────────────────────────────
  if (isAuthed()) showApp();
  else showLogin();
})();
