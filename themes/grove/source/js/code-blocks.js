(() => {
  const initializeCodeBlocks = () => {
    const blocks = document.querySelectorAll('.prose figure.highlight, .prose > pre');

    blocks.forEach((block, index) => {
      if (block.dataset.collapseReady === 'true') return;
      block.dataset.collapseReady = 'true';

      // ```text blocks are prose examples rather than source code.
      if (block.matches('figure.highlight.text')) return;

      const highlightedLines = block.querySelectorAll('.code .line');
      const plainText = block.textContent.replace(/\s+$/, '');
      const lineCount = highlightedLines.length || Math.max(1, plainText.split(/\r?\n/).length);
      const isLong = lineCount > 20 || block.scrollHeight > 440;

      let codeContainer = block;
      if (block.tagName === 'PRE') {
        codeContainer = document.createElement('div');
        codeContainer.className = 'code-frame';
        block.parentNode.insertBefore(codeContainer, block);
        codeContainer.appendChild(block);
      }

      const getCodeText = () => {
        if (highlightedLines.length) {
          return Array.from(highlightedLines, (line) => line.textContent).join('\n');
        }
        return plainText;
      };

      const copyText = async (value) => {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      };

      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'code-copy';
      copyButton.setAttribute('aria-label', '复制全部代码');
      copyButton.title = '复制全部代码';
      copyButton.textContent = '⧉ 复制';
      copyButton.addEventListener('click', async () => {
        try {
          await copyText(getCodeText());
          copyButton.classList.add('is-copied');
          copyButton.textContent = '✓ 已复制';
          window.setTimeout(() => {
            copyButton.classList.remove('is-copied');
            copyButton.textContent = '⧉ 复制';
          }, 1600);
        } catch (error) {
          copyButton.textContent = '复制失败';
          window.setTimeout(() => {
            copyButton.textContent = '⧉ 复制';
          }, 1600);
        }
      });
      codeContainer.appendChild(copyButton);

      if (!isLong) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-collapse is-collapsed';
      codeContainer.parentNode.insertBefore(wrapper, codeContainer);
      wrapper.appendChild(codeContainer);

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

