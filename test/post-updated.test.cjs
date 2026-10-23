const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const script = fs.readFileSync(path.join(__dirname, '../themes/grove/scripts/post-updated.js'), 'utf8');
const temporaryRoot = path.resolve(os.tmpdir());

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(temporaryRoot, 'grove-post-dates-'));
  t.after(() => {
    const target = path.resolve(directory);
    if (path.dirname(target) !== temporaryRoot || !path.basename(target).startsWith('grove-post-dates-')) throw new Error('Unexpected fixture path');
    fs.rmSync(target, { recursive: true, force: true });
  });
  return directory;
}

function load(directory, execute = execFileSync) {
  let helper, reset;
  const warnings = [];
  vm.runInNewContext(script, {
    require: name => name === 'node:child_process' ? { execFileSync: execute } : require(name),
    hexo: {
      base_dir: directory,
      log: { warn: message => warnings.push(message) },
      extend: {
        filter: { register: (_, fn) => { reset = fn; } },
        helper: { register: (_, fn) => { helper = fn; } }
      }
    }
  });
  return { updated: post => helper(post).toISOString(), reset: () => reset(), warnings };
}

function git(directory, args, timestamp) {
  return execFileSync('git', ['-c', 'user.name=Grove test', '-c', 'user.email=test@example.invalid', ...args], {
    cwd: directory,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...(timestamp ? { GIT_AUTHOR_DATE: timestamp, GIT_COMMITTER_DATE: timestamp } : {}) }
  }).trim();
}

function commit(directory, filename, content, timestamp) {
  fs.mkdirSync(path.dirname(path.join(directory, filename)), { recursive: true });
  fs.writeFileSync(path.join(directory, filename), content);
  git(directory, ['add', '--', filename]);
  git(directory, ['commit', '-m', 'Fixture change'], timestamp);
}

test('later article edits advance the date; first upload and unrelated deployment commits do not', t => {
  const directory = fixture(t);
  git(directory, ['init', '--initial-branch=main']);
  const filename = 'source/_posts/文章 with spaces.md';
  const post = { full_source: path.join(directory, filename), date: new Date('2026-10-01T00:00:00Z'), updated: new Date('2026-10-01T00:00:00Z') };
  commit(directory, filename, 'First upload', '2026-10-02T04:00:00Z');
  const resolver = load(directory);
  assert.equal(resolver.updated(post), '2026-10-01T00:00:00.000Z');

  commit(directory, filename, 'Revised article', '2026-10-03T06:00:00Z');
  resolver.reset();
  assert.equal(resolver.updated(post), '2026-10-03T06:00:00.000Z');
  assert.equal(post.updated.toISOString(), '2026-10-01T00:00:00.000Z', 'Do not persist inferred dates into Hexo source data');

  commit(directory, 'themes/grove/_config.yml', 'home_cover: {}', '2026-10-04T12:00:00Z');
  resolver.reset();
  assert.equal(resolver.updated(post), '2026-10-03T06:00:00.000Z');

  const renamed = 'source/_posts/renamed 文章.md';
  git(directory, ['mv', '--', filename, renamed]);
  git(directory, ['commit', '-m', 'Rename fixture'], '2026-10-05T08:00:00Z');
  resolver.reset();
  post.full_source = path.join(directory, renamed);
  assert.equal(resolver.updated(post), '2026-10-05T08:00:00.000Z', 'Follow renamed article history');

  post.updated = new Date('2026-10-06T00:00:00Z');
  assert.equal(resolver.updated(post), '2026-10-06T00:00:00.000Z', 'Keep a newer explicit updated value');
  post.date = new Date('2026-10-07T00:00:00Z');
  assert.equal(resolver.updated(post), '2026-10-07T00:00:00.000Z', 'Never report an update before publication');
});

test('untracked articles and source archives fall back to explicit dates', t => {
  const directory = fixture(t);
  const post = { full_source: path.join(directory, 'untracked.md'), date: new Date('2026-10-01T00:00:00Z'), updated: new Date('2026-10-02T00:00:00Z') };
  fs.writeFileSync(post.full_source, 'Article outside Git');
  assert.equal(load(directory).updated(post), '2026-10-02T00:00:00.000Z');
  git(directory, ['init', '--initial-branch=main']);
  commit(directory, 'README.md', 'Unrelated tracked file', '2026-10-03T00:00:00Z');
  assert.equal(load(directory).updated(post), '2026-10-02T00:00:00.000Z');
});

test('incomplete history uses safe date fallback instead of checkout time', t => {
  const directory = fixture(t);
  const resolver = load(directory, (_, args) => {
    assert.deepEqual(Array.from(args), ['rev-parse', '--is-shallow-repository']);
    return 'true\n';
  });
  assert.equal(resolver.updated({ full_source: path.join(directory, 'article.md'), date: new Date('2026-10-01T00:00:00Z') }), '2026-10-01T00:00:00.000Z');
  assert.equal(resolver.warnings.length, 1);
});
