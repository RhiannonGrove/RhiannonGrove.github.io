(() => {
  const layer = document.querySelector('.home-stars');
  if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const particleCount = window.innerWidth <= 700 ? 42 : 92;
  const colors = ['#ffffff', '#c9e7ff', '#9fcfff', '#ffe3a6'];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < particleCount; index += 1) {
    const star = document.createElement('span');
    const size = (Math.random() * 2.6 + .8).toFixed(2);
    const duration = (Math.random() * 8 + 8).toFixed(2);

    star.className = 'home-star';
    star.style.setProperty('--star-x', `${(Math.random() * 100).toFixed(2)}%`);
    star.style.setProperty('--star-y', `${(Math.random() * 100).toFixed(2)}%`);
    star.style.setProperty('--star-size', `${size}px`);
    star.style.setProperty('--star-color', colors[index % colors.length]);
    star.style.setProperty('--star-delay', `${(-Math.random() * Number(duration)).toFixed(2)}s`);
    star.style.setProperty('--star-duration', `${duration}s`);
    star.style.setProperty('--star-drift', `${(Math.random() * 36 - 18).toFixed(1)}px`);
    fragment.appendChild(star);
  }

  layer.appendChild(fragment);
})();

