'use strict';

const { execFileSync } = require('node:child_process');
let cachedInfo;

hexo.extend.filter.register('before_generate', function () {
  cachedInfo = undefined;
});

hexo.extend.helper.register('grove_site_info', function () {
  if (cachedInfo) return cachedInfo;

  let words = 0;
  let latestPostUpdate = 0;
  this.site.posts.each(post => {
    // Exclude code blocks (including highlighted line numbers), markup and entities.
    const prose = (post.content || '')
      .replace(/<figure\b[^>]*class=["'][^"']*\bhighlight\b[^"']*["'][^>]*>[\s\S]*?<\/figure>/gi, ' ')
      .replace(/<(pre|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ');
    const text = this.strip_html(prose).replace(/&(?:#\d+|#x[\da-f]+|[a-z]+);/gi, ' ');
    // One Han character counts as one word; Latin words and numbers count by token.
    words += (text.match(/\p{Script=Han}/gu) || []).length;
    words += (text.replace(/\p{Script=Han}/gu, ' ')
      .match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu) || []).length;
    latestPostUpdate = Math.max(latestPostUpdate, +post.updated || +post.date || 0);
  });

  // Git time stays stable across fresh checkouts and repeated builds.
  let updated = latestPostUpdate ? new Date(latestPostUpdate).toISOString() : null;
  try {
    const revisionDate = execFileSync('git', ['log', '-1', '--format=%cI'], {
      cwd: hexo.base_dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    if (Number.isFinite(Date.parse(revisionDate))) updated = revisionDate;
  } catch (_) {
    // Downloaded source archives can still use the latest article date.
  }

  cachedInfo = {
    posts: this.site.posts.length,
    words,
    wordLabel: words >= 1000 ? (words / 1000).toFixed(1) + 'k' : String(words),
    updated
  };
  return cachedInfo;
});
