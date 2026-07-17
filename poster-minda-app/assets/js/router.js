// assets/js/router.js
// Uruskan state aplikasi melalui URL query params supaya link boleh dikongsi.

const PARAM_KEYS = ['kategori', 'cari', 'subfolder', 'tahap', 'tag'];

export function getState() {
  const params = new URLSearchParams(window.location.search);
  return {
    kategori: params.get('kategori') || null,
    cari: params.get('cari') || '',
    subfolder: params.get('subfolder') || null,
    tahap: params.get('tahap') || null,
    tag: params.get('tag') || null, // comma separated
  };
}

export function setState(partial, { push = true } = {}) {
  const current = getState();
  const next = { ...current, ...partial };

  const params = new URLSearchParams();
  PARAM_KEYS.forEach((key) => {
    const val = next[key];
    if (val !== null && val !== undefined && val !== '') {
      params.set(key, val);
    }
  });

  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;

  if (push) {
    window.history.pushState(next, '', url);
  } else {
    window.history.replaceState(next, '', url);
  }
  return next;
}

export function onStateChange(callback) {
  window.addEventListener('popstate', () => callback(getState()));
}
