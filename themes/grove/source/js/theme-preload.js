// Run before styles are loaded, so saved preferences apply to the first paint.
(() => {
  'use strict';
  const root = document.documentElement;
  let theme = 'original';
  let background = root.dataset.backgroundDefault;
  let savedOpacity = null;
  try {
    const savedTheme = localStorage.getItem('grove-visual-theme');
    if (['original', 'morandi', 'wangxiang'].includes(savedTheme)) theme = savedTheme;
    const savedBackground = localStorage.getItem('grove-background-mode');
    if (background && ['image', 'video'].includes(savedBackground)) background = savedBackground;
    savedOpacity = localStorage.getItem('grove-card-opacity');
  } catch (_) {
    // Restricted storage must not prevent the website from opening.
  }
  root.dataset.visualTheme = theme;
  if (background) root.dataset.backgroundMode = background === 'video' && root.dataset.hasVideo === 'true' ? 'video' : 'image';

  const fallbacks = {
    original: { article: .66, widgets: .54 },
    morandi: { article: .90, widgets: .86 },
    wangxiang: { article: .90, widgets: .86 }
  };
  const parse = raw => {
    try { const value = JSON.parse(raw); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch (_) { return {}; }
  };
  const valid = value => typeof value === 'number' && Number.isFinite(value) && value >= .30 && value <= 1;
  const sanitize = raw => {
    const source = parse(raw);
    const result = {};
    Object.keys(fallbacks).forEach(name => {
      const values = source[name];
      if (!values || typeof values !== 'object') return;
      result[name] = {};
      ['article', 'widgets'].forEach(kind => { if (valid(values[kind])) result[name][kind] = values[kind]; });
    });
    return result;
  };
  const configured = sanitize(root.dataset.cardOpacityDefaults);
  let overrides = sanitize(savedOpacity);
  const currentTheme = () => Object.hasOwn(fallbacks, root.dataset.visualTheme) ? root.dataset.visualTheme : 'original';
  const values = () => {
    const name = currentTheme();
    return { ...fallbacks[name], ...configured[name], ...overrides[name] };
  };
  const apply = () => {
    const current = values();
    root.style.setProperty('--card-article-opacity', current.article);
    root.style.setProperty('--card-widget-opacity', current.widgets);
    return current;
  };
  const persist = () => {
    try { localStorage.setItem('grove-card-opacity', JSON.stringify(overrides)); return true; } catch (_) { return false; }
  };
  window.GroveCardOpacity = {
    apply,
    set(kind, value) {
      if (!['article', 'widgets'].includes(kind) || !valid(value)) return false;
      const name = currentTheme();
      overrides[name] = { ...overrides[name], [kind]: value };
      apply();
      return persist();
    },
    reset() { delete overrides[currentTheme()]; apply(); return persist(); },
    restore(raw) { overrides = sanitize(raw); apply(); }
  };
  apply();
})();
