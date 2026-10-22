(() => {
  'use strict';
  const root = document.documentElement;
  const settings = document.createElement('aside');
  settings.className = 'appearance-settings';
  settings.setAttribute('aria-label', '外观设置');
  settings.innerHTML = `
    <button class="appearance-trigger" type="button" aria-expanded="false" aria-controls="appearance-panel" aria-label="打开外观设置">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.3a2.2 2.2 0 0 0 1.4-3.9 1.7 1.7 0 0 1 1.1-3H18a3 3 0 0 0 3-3A8.6 8.6 0 0 0 12 3Z"/><circle cx="7.5" cy="10" r=".7"/><circle cx="11" cy="6.8" r=".7"/><circle cx="15.5" cy="7.5" r=".7"/></svg>
      <span>外观</span>
    </button>
    <section class="appearance-panel" id="appearance-panel" aria-labelledby="appearance-title" hidden>
      <div class="appearance-heading"><h2 id="appearance-title">外观设置</h2><button class="appearance-close" type="button" aria-label="关闭外观设置">×</button></div>
      <fieldset><legend>视觉主题</legend>
        <label class="appearance-option"><input type="radio" name="grove-theme" value="original"><span class="appearance-swatch swatch-original" aria-hidden="true"></span><span><strong>Original</strong><small>原有玻璃主题</small></span><span class="appearance-check" aria-hidden="true">✓</span></label>
        <label class="appearance-option"><input type="radio" name="grove-theme" value="morandi"><span class="appearance-swatch swatch-morandi" aria-hidden="true"></span><span><strong>Morandi Light</strong><small>莫兰迪浅色</small></span><span class="appearance-check" aria-hidden="true">✓</span></label>
        <label class="appearance-option"><input type="radio" name="grove-theme" value="wangxiang"><span class="appearance-swatch swatch-wangxiang" aria-hidden="true"></span><span><strong>Wangxiang Dark</strong><small>万象深色</small></span><span class="appearance-check" aria-hidden="true">✓</span></label>
      </fieldset>
      <fieldset class="appearance-background"><legend>背景</legend><div class="appearance-background-options">
        <label><input type="radio" name="grove-background" value="video"><span>动态视频</span></label>
        <label><input type="radio" name="grove-background" value="image"><span>静态图片</span></label>
      </div><p class="appearance-note"></p></fieldset>
      <fieldset class="appearance-opacity"><legend>卡片不透明度</legend>
        <div class="appearance-range-heading"><label for="card-article-opacity">正文卡片</label><output for="card-article-opacity" id="card-article-value"></output></div>
        <input id="card-article-opacity" name="grove-card-opacity-article" type="range" min="30" max="100" step="1" aria-describedby="card-opacity-note">
        <div class="appearance-range-heading"><label for="card-widget-opacity">列表／侧栏卡片</label><output for="card-widget-opacity" id="card-widget-value"></output></div>
        <input id="card-widget-opacity" name="grove-card-opacity-widgets" type="range" min="30" max="100" step="1" aria-describedby="card-opacity-note">
        <p class="appearance-note" id="card-opacity-note">数值越小，背景越清楚。只调整卡片底色，不会淡化文字。</p>
        <button class="appearance-reset" type="button">恢复本主题默认</button>
      </fieldset>
      <p class="appearance-status" role="status" aria-live="polite"></p>
    </section>`;
  document.body.appendChild(settings);
  const trigger = settings.querySelector('.appearance-trigger');
  const panel = settings.querySelector('.appearance-panel');
  const status = settings.querySelector('.appearance-status');
  const themeNames = { original: 'Original', morandi: 'Morandi Light', wangxiang: 'Wangxiang Dark' };
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const opacity = window.GroveCardOpacity;
  let transitionTimer;

  const updateNavigation = () => {
    document.querySelectorAll('.site-header nav a').forEach(link => {
      const target = new URL(link.href);
      const matches = target.hash ? location.pathname === target.pathname && location.hash === target.hash : target.pathname === '/' ? location.pathname === '/' && !location.hash : location.pathname.startsWith(target.pathname);
      if (matches) link.setAttribute('aria-current', location.pathname === target.pathname ? 'page' : 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const updateControls = () => {
    const current = root.dataset.visualTheme || 'original';
    settings.querySelectorAll('[name="grove-theme"]').forEach(input => { input.checked = input.value === current; });
    settings.querySelectorAll('[name="grove-background"]').forEach(input => { input.checked = input.value === root.dataset.backgroundMode; });
    trigger.title = `外观设置 · ${themeNames[current]}`;
    const videoOption = settings.querySelector('[name="grove-background"][value="video"]');
    videoOption.disabled = root.dataset.hasVideo !== 'true';
    settings.querySelector('.appearance-background').hidden = !root.dataset.backgroundDefault;
    settings.querySelector('.appearance-note').textContent = motion.matches ? '系统已开启减少动态效果，当前使用静态图片。' : videoOption.disabled ? '站点暂未配置视频背景。' : '背景模式与视觉主题分别保存。';
    settings.querySelector('.appearance-opacity').hidden = !opacity || !root.hasAttribute('data-card-opacity-defaults');
    if (opacity) {
      const currentOpacity = opacity.apply();
      [['article', 'article'], ['widgets', 'widget']].forEach(([kind, id]) => {
        const percent = Math.round(currentOpacity[kind] * 100);
        const range = settings.querySelector(`#card-${id}-opacity`);
        range.value = percent;
        range.setAttribute('aria-valuetext', `${percent}% 不透明度`);
        settings.querySelector(`#card-${id}-value`).value = `${percent}%`;
      });
    }
  };

  const save = (key, value) => {
    try { localStorage.setItem(key, value); return true; } catch (_) { return false; }
  };
  settings.addEventListener('input', event => {
    const input = event.target;
    if (opacity && input.name.startsWith('grove-card-opacity-')) {
      const kind = input.name.slice('grove-card-opacity-'.length);
      const saved = opacity.set(kind, Number(input.value) / 100);
      status.textContent = saved ? '' : '浏览器未允许保存偏好，本次调整仍然生效。';
      updateControls();
    }
  });
  settings.addEventListener('change', event => {
    const input = event.target;
    if (input.name === 'grove-theme' && Object.hasOwn(themeNames, input.value)) {
      window.clearTimeout(transitionTimer);
      if (!motion.matches) root.classList.add('appearance-transition');
      root.dataset.visualTheme = input.value;
      const saved = save('grove-visual-theme', input.value);
      status.textContent = `已切换至 ${themeNames[input.value]}${saved ? '' : '（浏览器未允许保存偏好）'}`;
      transitionTimer = window.setTimeout(() => root.classList.remove('appearance-transition'), 240);
    } else if (input.name === 'grove-background' && ['video', 'image'].includes(input.value)) {
      root.dataset.backgroundMode = input.value === 'video' && root.dataset.hasVideo === 'true' ? 'video' : 'image';
      const saved = save('grove-background-mode', root.dataset.backgroundMode);
      status.textContent = `已切换至${root.dataset.backgroundMode === 'video' ? '动态视频' : '静态图片'}${saved ? '' : '（浏览器未允许保存偏好）'}`;
    } else if (input.name.startsWith('grove-card-opacity-')) {
      status.textContent = status.textContent || '卡片不透明度已保存。';
    }
    updateControls();
  });
  settings.querySelector('.appearance-reset').addEventListener('click', () => {
    const saved = opacity && opacity.reset();
    updateControls();
    status.textContent = `已恢复 ${themeNames[root.dataset.visualTheme]} 的卡片默认值${saved ? '' : '（浏览器未允许保存偏好）'}`;
  });

  const closePanel = (restoreFocus = false) => {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', '打开外观设置');
    if (restoreFocus) trigger.focus({ preventScroll: true });
  };
  trigger.addEventListener('click', () => {
    if (!panel.hidden) { closePanel(); return; }
    updateControls();
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', '关闭外观设置');
    settings.querySelector('[name="grove-theme"]:checked').focus({ preventScroll: true });
  });
  settings.querySelector('.appearance-close').addEventListener('click', () => closePanel(true));
  document.addEventListener('pointerdown', event => { if (!settings.contains(event.target)) closePanel(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); closePanel(true); } });
  window.addEventListener('storage', event => {
    if (event.key === 'grove-visual-theme' || event.key === null) root.dataset.visualTheme = Object.hasOwn(themeNames, event.newValue) ? event.newValue : 'original';
    if ((event.key === 'grove-background-mode' || event.key === null) && root.dataset.backgroundDefault) {
      const mode = ['video', 'image'].includes(event.newValue) ? event.newValue : root.dataset.backgroundDefault;
      root.dataset.backgroundMode = mode === 'video' && root.dataset.hasVideo === 'true' ? 'video' : 'image';
    }
    if (opacity && (event.key === 'grove-card-opacity' || event.key === null)) opacity.restore(event.newValue);
    updateControls();
  });
  motion.addEventListener('change', updateControls);
  window.addEventListener('hashchange', updateNavigation);
  updateNavigation();
  updateControls();
})();
