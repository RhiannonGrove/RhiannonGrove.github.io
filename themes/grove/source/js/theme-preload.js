// Run before styles are loaded, so saved preferences apply to the first paint.
(() => {
  'use strict';
  const root = document.documentElement;
  let theme = 'original';
  let background = root.dataset.backgroundDefault;
  try {
    const savedTheme = localStorage.getItem('grove-visual-theme');
    if (['original', 'morandi', 'wangxiang'].includes(savedTheme)) theme = savedTheme;
    const savedBackground = localStorage.getItem('grove-background-mode');
    if (background && ['image', 'video'].includes(savedBackground)) background = savedBackground;
  } catch (_) {
    // Restricted storage must not prevent the website from opening.
  }
  root.dataset.visualTheme = theme;
  if (background) root.dataset.backgroundMode = background === 'video' && root.dataset.hasVideo === 'true' ? 'video' : 'image';
})();
