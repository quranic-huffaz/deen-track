// assets/js/app.js
import { semuaData } from '../../data/index.js';
import { getState, setState, onStateChange } from './router.js';

/* ---------------------------------------------------------------------- */
/* Helpers                                                                  */
/* ---------------------------------------------------------------------- */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function icon(name, extraAttrs = '') {
  return `<i data-lucide="${name}" ${extraAttrs}></i>`;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatTarikh(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatNumber(n) {
  return new Intl.NumberFormat('ms-MY').format(n);
}

const LEVEL_ORDER = { Mudah: 0, Sederhana: 1, Sukar: 2 };

/* ---------------------------------------------------------------------- */
/* Flatten data + lookups                                                  */
/* ---------------------------------------------------------------------- */

const kategoriBySlug = new Map(semuaData.map((k) => [k.slug, k]));

const allPosters = semuaData.flatMap((k) =>
  k.posters.map((p) => ({ ...p, kategoriNama: k.kategori, kategoriIkon: k.ikon }))
);

const posterById = new Map(allPosters.map((p) => [p.id, p]));

const TOTAL_POSTERS = allPosters.length;
const TOTAL_KATEGORI = semuaData.length;

/* ---------------------------------------------------------------------- */
/* DOM refs                                                                 */
/* ---------------------------------------------------------------------- */

const app = $('#app');
const searchInput = $('#global-search');
const searchWrap = $('#header-search-wrap');
const searchClearBtn = $('#search-clear-btn');
const header = $('#site-header');
const modalBackdrop = $('#modal-backdrop');
const sheetBackdrop = $('#sheet-backdrop');
const filterSheet = $('#filter-sheet');

/* ---------------------------------------------------------------------- */
/* Filtering engine                                                         */
/* ---------------------------------------------------------------------- */

function matchesFilters(poster, filters, skipKey) {
  const { cari, subfolder, tahap, tags } = filters;

  if (skipKey !== 'cari' && cari) {
    const q = cari.toLowerCase();
    const haystack = [poster.tajuk, poster.subtajuk, poster.penulis, ...(poster.tags || [])]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (skipKey !== 'subfolder' && subfolder) {
    if (poster.subfolder !== subfolder) return false;
  }
  if (skipKey !== 'tahap' && tahap) {
    if (poster.tahapKesukaran !== tahap) return false;
  }
  if (skipKey !== 'tags' && tags && tags.length) {
    const posterTags = poster.tags || [];
    if (!tags.every((t) => posterTags.includes(t))) return false;
  }
  return true;
}

function filterPosters(posters, filters) {
  return posters.filter((p) => matchesFilters(p, filters, null));
}

function buildFacet(posters, filters, key, valueFn) {
  const counts = new Map();
  posters.forEach((p) => {
    if (!matchesFilters(p, filters, key)) return;
    const val = valueFn(p);
    if (val === undefined || val === null) return;
    if (Array.isArray(val)) {
      val.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
    } else {
      counts.set(val, (counts.get(val) || 0) + 1);
    }
  });
  return counts;
}

/* ---------------------------------------------------------------------- */
/* Icon SVG for category (fallback set beyond lucide string names)         */
/* ---------------------------------------------------------------------- */

const CATEGORY_ICON_MAP = {
  'graduation-cap': 'graduation-cap',
  cpu: 'cpu',
};

function categoryIcon(slug) {
  const kat = kategoriBySlug.get(slug);
  return CATEGORY_ICON_MAP[kat?.ikon] || 'folder';
}

/* ---------------------------------------------------------------------- */
/* Templates                                                                */
/* ---------------------------------------------------------------------- */

function tplBreadcrumb(parts) {
  // parts: [{label, state|null}]
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${parts
    .map((p, i) => {
      const isLast = i === parts.length - 1;
      const sep = i > 0 ? `<span class="sep">/</span>` : '';
      if (isLast || !p.href) {
        return `${sep}<span class="${isLast ? 'current' : ''}">${escapeHtml(p.label)}</span>`;
      }
      return `${sep}<a href="${p.href}" data-nav>${escapeHtml(p.label)}</a>`;
    })
    .join('')}</nav>`;
}

function tplCategoryCard(kat) {
  return `
  <a class="category-card" href="?kategori=${kat.slug}" data-nav data-slug="${kat.slug}">
    <div class="cat-icon">${icon(categoryIcon(kat.slug))}</div>
    <h3>${escapeHtml(kat.kategori)}</h3>
    <p>${escapeHtml(kat.deskripsi)}</p>
    <div class="cat-meta">
      <span>${kat.posters.length} poster</span>
      <span class="arrow">${icon('arrow-right')}</span>
    </div>
  </a>`;
}

function tplPosterCard(p) {
  return `
  <article class="poster-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Buka ${escapeHtml(p.tajuk)}">
    <div class="thumb-wrap">
      <img src="${p.gambarThumbnail}" alt="${escapeHtml(p.tajuk)}" loading="lazy">
      <span class="level-tag">${escapeHtml(p.tahapKesukaran)}</span>
    </div>
    <div class="card-body">
      <h4>${escapeHtml(p.tajuk)}</h4>
      <p class="subtitle">${escapeHtml(p.subtajuk)}</p>
      <div class="tag-row">${(p.tags || []).slice(0, 3).map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>
    </div>
    <div class="card-footer">
      <span>${escapeHtml(p.penulis)}</span>
      <span>${icon('eye', 'width="12" height="12"')} ${formatNumber(p.bilanganPapar)}</span>
    </div>
  </article>`;
}

function tplSkeletonCard() {
  return `
  <div class="poster-card skeleton-card">
    <div class="thumb-wrap skeleton"></div>
    <div class="card-body">
      <div class="sk-line skeleton" style="width:80%"></div>
      <div class="sk-line skeleton" style="width:55%"></div>
      <div class="sk-line skeleton" style="width:40%;margin-top:10px"></div>
    </div>
  </div>`;
}

function tplEmptyState() {
  return `
  <div class="empty-state">
    <div class="icon-wrap">${icon('search-x')}</div>
    <h3>Tiada hasil dijumpai</h3>
    <p>Cuba kata kunci lain atau kosongkan sebahagian penapis untuk lihat lebih banyak poster.</p>
  </div>`;
}

function tplFilterOption(label, value, count, isActive, dataKey) {
  return `
  <div class="filter-option ${isActive ? 'active' : ''}" data-filter-key="${dataKey}" data-filter-value="${escapeHtml(value)}" role="button" tabindex="0">
    <span>${escapeHtml(label)}</span>
    <span class="fo-count">${count}</span>
  </div>`;
}

function renderFilterPanelContent(scopePosters, filters) {
  const subfolderCounts = buildFacet(scopePosters, filters, 'subfolder', (p) => p.subfolder);
  const tahapCounts = buildFacet(scopePosters, filters, 'tahap', (p) => p.tahapKesukaran);
  const tagCounts = buildFacet(scopePosters, filters, 'tags', (p) => p.tags);

  const activeTags = filters.tags || [];

  const subfolderHtml = Array.from(subfolderCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([val, count]) => tplFilterOption(val, val, count, filters.subfolder === val, 'subfolder'))
    .join('');

  const tahapHtml = ['Mudah', 'Sederhana', 'Sukar']
    .filter((t) => tahapCounts.has(t))
    .map((val) => tplFilterOption(val, val, tahapCounts.get(val), filters.tahap === val, 'tahap'))
    .join('');

  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([val, count]) => tplFilterOption(`#${val}`, val, count, activeTags.includes(val), 'tags'))
    .join('');

  const hasActiveFilters = filters.subfolder || filters.tahap || (filters.tags && filters.tags.length);

  return `
    ${subfolderHtml ? `<div class="filter-group"><div class="fg-title">Subfolder</div>${subfolderHtml}</div>` : ''}
    ${tahapHtml ? `<div class="filter-group"><div class="fg-title">Tahap Kesukaran</div>${tahapHtml}</div>` : ''}
    ${topTags ? `<div class="filter-group"><div class="fg-title">Tag Popular</div>${topTags}</div>` : ''}
    ${hasActiveFilters ? `<button class="filter-clear-btn" id="clear-filters-btn">${icon('x', 'width="14" height="14"')} Kosongkan Penapis</button>` : ''}
  `;
}

function tplChips(filters) {
  const chips = [];
  if (filters.subfolder) chips.push({ key: 'subfolder', label: filters.subfolder, value: filters.subfolder });
  if (filters.tahap) chips.push({ key: 'tahap', label: filters.tahap, value: filters.tahap });
  (filters.tags || []).forEach((t) => chips.push({ key: 'tags', label: `#${t}`, value: t }));
  if (!chips.length) return '';
  return `<div class="chip-row">${chips
    .map(
      (c) => `<span class="chip" data-chip-key="${c.key}" data-chip-value="${escapeHtml(c.value)}">${escapeHtml(c.label)}<button aria-label="Buang penapis">${icon('x')}</button></span>`
    )
    .join('')}</div>`;
}

/* ---------------------------------------------------------------------- */
/* View renderers                                                          */
/* ---------------------------------------------------------------------- */

function currentFilters(state) {
  return {
    cari: state.cari || '',
    subfolder: state.subfolder || null,
    tahap: state.tahap || null,
    tags: state.tag ? state.tag.split(',').filter(Boolean) : [],
  };
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <span class="hero-eyebrow"><span class="dot"></span> Platform Kongsi Peta Minda</span>
      <h1>Kongsi & terokai <span class="accent">peta minda</span> berkualiti premium</h1>
      <p class="lead">Koleksi peta minda pengajian dan teknologi yang tersusun rapi — cari, tapis, dan muat turun terus untuk rujukan pantas anda.</p>
      <div class="hero-stats">
        <div class="hero-stat"><span class="num">${formatNumber(TOTAL_POSTERS)}</span><span class="label">Jumlah Poster</span></div>
        <div class="hero-stat"><span class="num">${formatNumber(TOTAL_KATEGORI)}</span><span class="label">Kategori</span></div>
      </div>
    </section>
    <div class="section-heading">
      <h2>Folder / Kategori</h2>
      <span class="count">${TOTAL_KATEGORI} kategori</span>
    </div>
    <div class="category-grid">
      ${semuaData.map(tplCategoryCard).join('')}
    </div>
  `;
  refreshIcons();
}

function renderPosterScope({ scopeName, scopePosters, breadcrumbParts, state, emptyHint }) {
  const filters = currentFilters(state);
  const filtered = filterPosters(scopePosters, filters);

  const filterPanelHtml = renderFilterPanelContent(scopePosters, filters);
  const chipsHtml = tplChips(filters);

  app.innerHTML = `
    ${tplBreadcrumb(breadcrumbParts)}
    <div class="toolbar">
      <span class="result-text"><strong>${filtered.length}</strong> daripada ${scopePosters.length} poster</span>
      <button class="filter-toggle-btn" id="open-filter-sheet-btn">
        ${icon('sliders-horizontal')} Penapis
        ${filters.subfolder || filters.tahap || filters.tags.length ? `<span class="badge">${[filters.subfolder, filters.tahap, ...filters.tags].filter(Boolean).length}</span>` : ''}
      </button>
    </div>
    ${chipsHtml}
    <div class="content-layout">
      <aside class="filter-panel" id="desktop-filter-panel">${filterPanelHtml}</aside>
      <div class="poster-grid" id="poster-grid">
        ${filtered.length ? filtered.map(tplPosterCard).join('') : tplEmptyState()}
      </div>
    </div>
  `;

  // sync mobile sheet content
  filterSheet.innerHTML = `<div class="sheet-handle"></div>${filterPanelHtml}`;

  refreshIcons();
  bindScopeEvents(filtered);
}

function renderCategory(slug, state) {
  const kat = kategoriBySlug.get(slug);
  if (!kat) {
    renderHome();
    return;
  }
  const scopePosters = allPosters.filter((p) => p.folder === slug);
  renderPosterScope({
    scopeName: kat.kategori,
    scopePosters,
    breadcrumbParts: [
      { label: 'Utama', href: '?' },
      { label: kat.kategori },
    ],
    state,
  });
}

function renderSearchResults(state) {
  renderPosterScope({
    scopeName: 'Hasil Carian',
    scopePosters: allPosters,
    breadcrumbParts: [
      { label: 'Utama', href: '?' },
      { label: `Carian: "${state.cari}"` },
    ],
    state,
  });
}

function render(state) {
  if (state.cari) {
    renderSearchResults(state);
  } else if (state.kategori) {
    renderCategory(state.kategori, state);
  } else {
    renderHome();
  }
  syncSearchInput(state);
}

/* ---------------------------------------------------------------------- */
/* Event binding                                                           */
/* ---------------------------------------------------------------------- */

function bindScopeEvents(currentList) {
  $$('#poster-grid .poster-card').forEach((card) => {
    const id = card.dataset.id;
    const open = () => openModal(id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  $$('.filter-option').forEach((el) => {
    const activate = () => toggleFilter(el.dataset.filterKey, el.dataset.filterValue);
    el.addEventListener('click', activate);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') activate(); });
  });

  const clearBtn = $('#clear-filters-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearFilters);

  $$('.chip').forEach((chip) => {
    chip.querySelector('button').addEventListener('click', () => {
      toggleFilter(chip.dataset.chipKey, chip.dataset.chipValue, true);
    });
  });

  const openSheetBtn = $('#open-filter-sheet-btn');
  if (openSheetBtn) openSheetBtn.addEventListener('click', openFilterSheet);
}

function toggleFilter(key, value, forceOff = false) {
  const state = getState();
  if (key === 'tags') {
    const currentTags = state.tag ? state.tag.split(',').filter(Boolean) : [];
    let next;
    if (currentTags.includes(value)) {
      next = currentTags.filter((t) => t !== value);
    } else if (!forceOff) {
      next = [...currentTags, value];
    } else {
      next = currentTags;
    }
    setState({ tag: next.join(',') || null });
  } else {
    const isActive = state[key] === value;
    setState({ [key]: isActive || forceOff ? null : value });
  }
  render(getState());
  closeFilterSheet();
}

function clearFilters() {
  setState({ subfolder: null, tahap: null, tag: null });
  render(getState());
  closeFilterSheet();
}

function syncSearchInput(state) {
  if (document.activeElement !== searchInput) {
    searchInput.value = state.cari || '';
  }
  searchWrap.classList.toggle('has-value', !!searchInput.value);
}

let searchDebounce;
searchInput.addEventListener('input', () => {
  searchWrap.classList.toggle('has-value', !!searchInput.value);
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    setState({ cari: searchInput.value.trim() });
    render(getState());
  }, 180);
});

searchClearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchWrap.classList.remove('has-value');
  setState({ cari: '' });
  render(getState());
  searchInput.focus();
});

/* Nav via data-nav links (breadcrumb, category cards) */
document.addEventListener('click', (e) => {
  const navEl = e.target.closest('[data-nav]');
  if (!navEl) return;
  e.preventDefault();
  const href = navEl.getAttribute('href');
  const params = new URLSearchParams(href.replace('?', ''));
  const next = {
    kategori: params.get('kategori') || null,
    cari: '',
    subfolder: null,
    tahap: null,
    tag: null,
  };
  setState(next);
  render(getState());
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Browser back/forward */
onStateChange((state) => render(state));

/* ---------------------------------------------------------------------- */
/* Header scroll shadow                                                    */
/* ---------------------------------------------------------------------- */
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 4);
}, { passive: true });

/* ---------------------------------------------------------------------- */
/* Filter bottom sheet (mobile)                                            */
/* ---------------------------------------------------------------------- */
function openFilterSheet() {
  sheetBackdrop.classList.add('open');
  filterSheet.classList.add('open');
  refreshIcons();
}
function closeFilterSheet() {
  sheetBackdrop.classList.remove('open');
  filterSheet.classList.remove('open');
}
sheetBackdrop.addEventListener('click', closeFilterSheet);

/* ---------------------------------------------------------------------- */
/* Modal / lightbox                                                         */
/* ---------------------------------------------------------------------- */

function openModal(id) {
  const p = posterById.get(id);
  if (!p) return;

  modalBackdrop.innerHTML = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-label="${escapeHtml(p.tajuk)}">
      <div class="modal-image">
        <img src="${p.gambar}" alt="${escapeHtml(p.tajuk)}" id="modal-img">
        <span class="zoom-hint">${icon('zoom-in', 'width="12" height="12"')} Klik untuk zoom</span>
      </div>
      <div class="modal-info">
        <button class="modal-close" id="modal-close-btn" aria-label="Tutup">${icon('x')}</button>
        <span class="level-tag">${escapeHtml(p.tahapKesukaran)}</span>
        <h2>${escapeHtml(p.tajuk)}</h2>
        <p class="subtitle">${escapeHtml(p.subtajuk)}</p>
        <div class="modal-meta">
          <div class="meta-item"><div class="meta-label">Penulis</div><div class="meta-value">${escapeHtml(p.penulis)}</div></div>
          <div class="meta-item"><div class="meta-label">Tarikh</div><div class="meta-value">${formatTarikh(p.tarikh)}</div></div>
          <div class="meta-item"><div class="meta-label">Kategori</div><div class="meta-value">${escapeHtml(p.kategoriNama)}</div></div>
          <div class="meta-item"><div class="meta-label">Dipapar</div><div class="meta-value">${formatNumber(p.bilanganPapar)}x</div></div>
        </div>
        <div class="tag-row">${(p.tags || []).map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>
        <div class="modal-actions">
          <a class="btn-primary" href="${p.pautanMuatTurun}" download target="_blank" rel="noopener">${icon('download', 'width="16" height="16"')} Muat Turun</a>
          <button class="btn-secondary" id="modal-copy-link-btn">${icon('link', 'width="16" height="16"')} Salin Pautan</button>
        </div>
      </div>
    </div>
  `;
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  refreshIcons();

  const img = $('#modal-img');
  img.addEventListener('click', () => img.classList.toggle('zoomed'));

  $('#modal-close-btn').addEventListener('click', closeModal);

  $('#modal-copy-link-btn').addEventListener('click', async () => {
    const url = `${window.location.origin}${window.location.pathname}?kategori=${p.folder}&cari=${encodeURIComponent(p.tajuk)}`;
    try {
      await navigator.clipboard.writeText(url);
      const btn = $('#modal-copy-link-btn');
      const original = btn.innerHTML;
      btn.innerHTML = `${icon('check', 'width="16" height="16"')} Disalin`;
      refreshIcons();
      setTimeout(() => { btn.innerHTML = original; refreshIcons(); }, 1600);
    } catch (err) {
      /* clipboard unavailable — silently ignore */
    }
  });
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeFilterSheet();
  }
});

/* ---------------------------------------------------------------------- */
/* Mobile bottom nav                                                       */
/* ---------------------------------------------------------------------- */
$('#nav-home-btn')?.addEventListener('click', () => {
  setState({ kategori: null, cari: '', subfolder: null, tahap: null, tag: null });
  render(getState());
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
$('#nav-search-btn')?.addEventListener('click', () => {
  searchInput.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
$('#nav-filter-btn')?.addEventListener('click', () => {
  if ($('#poster-grid')) openFilterSheet();
});

/* ---------------------------------------------------------------------- */
/* Skeleton loading simulation on first paint, then real render            */
/* ---------------------------------------------------------------------- */

function showInitialSkeleton() {
  app.innerHTML = `
    <section class="hero">
      <span class="hero-eyebrow"><span class="dot"></span> Platform Kongsi Peta Minda</span>
      <h1>Kongsi & terokai <span class="accent">peta minda</span> berkualiti premium</h1>
    </section>
    <div class="category-grid">
      ${Array.from({ length: 3 }).map(() => `<div class="category-card skeleton" style="height:170px"></div>`).join('')}
    </div>
  `;
}

showInitialSkeleton();
setTimeout(() => {
  render(getState());
}, 260);
