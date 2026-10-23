'use strict';

const { execFileSync } = require('node:child_process');
const { relative, sep } = require('node:path');
const historyCache = new Map();
let completeHistory;

hexo.extend.filter.register('before_generate', function () {
  historyCache.clear();
  completeHistory = undefined;
});

const git = args => execFileSync('git', args, {
  cwd: hexo.base_dir,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore']
}).trim();

function lastRevision(fullSource) {
  if (!fullSource) return 0;
  if (historyCache.has(fullSource)) return historyCache.get(fullSource);
  let timestamp = 0;
  try {
    if (completeHistory === undefined) {
      completeHistory = git(['rev-parse', '--is-shallow-repository']) === 'false';
      if (!completeHistory) hexo.log.warn('Article update dates need complete Git history. Fetch with --unshallow or set checkout fetch-depth: 0.');
    }
    if (completeHistory) {
      const filename = relative(hexo.base_dir, fullSource).split(sep).join('/');
      const revisions = git(['--literal-pathspecs', 'log', '--follow', '-n', '2', '--format=%cI', '--', filename])
        .split(/\r?\n/).filter(Boolean);
      // A first upload alone is not a later edit. Follow history across file renames.
      if (revisions.length > 1) timestamp = Date.parse(revisions[0]) || 0;
    }
  } catch (_) {
    // Source ZIPs and untracked posts still use their explicit dates.
    if (completeHistory === undefined) completeHistory = false;
  }
  historyCache.set(fullSource, timestamp);
  return timestamp;
}

hexo.extend.helper.register('grove_post_updated', function (post) {
  const published = Number(post.date) || 0;
  const explicit = Number(post.updated) || 0;
  const revised = lastRevision(post.full_source);
  // Old front-matter dates must not mask a newer committed edit or precede publication.
  return new Date(Math.max(published, explicit, revised));
});
