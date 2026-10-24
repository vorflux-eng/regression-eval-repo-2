const test = require('node:test');
const assert = require('node:assert');
const { createServer } = require('./server');

test('GET /status returns ok', async (t) => {
  const server = createServer().listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://localhost:${server.address().port}`;

  const res = await fetch(`${base}/status`);
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.deepStrictEqual(await res.json(), { status: 'ok' });

  const post = await fetch(`${base}/status`, { method: 'POST' });
  assert.strictEqual(post.status, 405);

  const missing = await fetch(`${base}/nope`);
  assert.strictEqual(missing.status, 404);
});
