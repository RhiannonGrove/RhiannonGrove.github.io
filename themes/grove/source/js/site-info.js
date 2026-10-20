(() => {
  'use strict';

  const settings = document.currentScript;
  document.querySelectorAll('.site-info-updated').forEach(time => {
    const timestamp = Date.parse(time.dateTime);
    if (!Number.isFinite(timestamp)) return;
    const elapsed = Math.max(0, Date.now() - timestamp);
    const days = Math.floor(elapsed / 86400000);
    if (days >= 365) return; // Keep the exact date for older sites.
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor(elapsed / 60000);
    time.textContent = days ? `${days} 天前` : hours ? `${hours} 小时前` : minutes ? `${minutes} 分钟前` : '刚刚';
  });

  const counters = [...document.querySelectorAll('#busuanzi_value_site_uv, #busuanzi_value_site_pv')];
  const markUnavailable = () => counters.forEach(counter => {
    if (counter.textContent === '—') counter.title = '统计服务暂不可用，请稍后再试';
  });

  // Local previews must not send visits or display shared localhost statistics.
  try {
    if (location.hostname !== new URL(settings.dataset.siteUrl).hostname || !/^https?:$/.test(location.protocol)) {
      counters.forEach(counter => { counter.title = '访问统计仅在正式网站显示'; });
      return;
    }
  } catch (_) {
    markUnavailable();
    return;
  }

  counters.forEach(counter => {
    const observer = new MutationObserver(() => {
      if (/^\d+$/.test(counter.textContent.trim())) {
        counter.title = counter.id.endsWith('_uv') ? '本站累计访客数（UV）' : '本站累计页面浏览量（PV）';
        observer.disconnect();
      }
    });
    observer.observe(counter, { childList: true, characterData: true, subtree: true });
  });

  // Loaded on every theme page so reading articles also contributes to the site total.
  const script = document.createElement('script');
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.async = true;
  script.onerror = markUnavailable;
  document.head.appendChild(script);
  window.setTimeout(markUnavailable, 12000);
})();
