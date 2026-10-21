(() => {
  'use strict';

  const video = document.querySelector('.site-background-video');
  if (!video) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let previousMode = root.dataset.backgroundMode;
  let failed = false;
  video.muted = true;

  const hideVideo = () => video.classList.remove('is-playing');
  const syncPlayback = () => {
    const mode = root.dataset.backgroundMode || root.dataset.backgroundDefault || 'video';
    if (mode !== previousMode) { failed = false; previousMode = mode; }
    if (mode === 'image') {
      video.pause();
      hideVideo();
      if (video.hasAttribute('src')) { video.removeAttribute('src'); video.load(); }
      return;
    }
    if (failed || reducedMotion.matches || document.hidden) {
      video.pause();
      if (reducedMotion.matches || failed) hideVideo();
      return;
    }

    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    const attempt = video.play();
    if (attempt) attempt.catch(() => {
      // Autoplay may be blocked. Keep the image visible, without interrupting reading.
      if (video.paused) hideVideo();
    });
  };

  video.addEventListener('playing', () => {
    if (!failed && root.dataset.backgroundMode !== 'image' && !reducedMotion.matches && !document.hidden) video.classList.add('is-playing');
  });
  video.addEventListener('error', () => {
    failed = true;
    hideVideo();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  document.addEventListener('pointerdown', syncPlayback, { once: true, passive: true });
  document.addEventListener('keydown', syncPlayback, { once: true });
  reducedMotion.addEventListener('change', syncPlayback);
  new MutationObserver(syncPlayback).observe(root, { attributes: true, attributeFilter: ['data-background-mode'] });
  syncPlayback();
})();
