(() => {
  const initializeCodeBlocks = () => {
    const blocks = document.querySelectorAll('.prose figure.highlight, .prose > pre');

    blocks.forEach((block, index) => {
      if (block.dataset.collapseReady === 'true') return;
      block.dataset.collapseReady = 'true';

      const highlightedLines = block.querySelectorAll('.code .line');
      const plainText = block.textContent.replace(/\s+$/, '');
      const lineCount = highlightedLines.length || Math.max(1, plainText.split(/\r?\n/).length);
      const isLong = lineCount > 20 || block.scrollHeight > 440;

      if (!isLong) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-collapse is-collapsed';
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-toggle';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', `展开代码，共 ${lineCount} 行`);
      button.textContent = `展开代码（${lineCount} 行）`;

      button.addEventListener('click', () => {
        const willExpand = wrapper.classList.contains('is-collapsed');
        wrapper.classList.toggle('is-collapsed', !willExpand);
        button.setAttribute('aria-expanded', String(willExpand));
        button.setAttribute('aria-label', willExpand ? '折叠代码' : `展开代码，共 ${lineCount} 行`);
        button.textContent = willExpand ? '收起代码' : `展开代码（${lineCount} 行）`;
      });

      wrapper.appendChild(button);
      wrapper.dataset.codeIndex = String(index);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCodeBlocks);
  } else {
    initializeCodeBlocks();
  }
})();

