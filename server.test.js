'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createServer } = require('./server');

test('status endpoint', async (t) => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());
  const base = `http://localhost:${server.address().port}`;

  await t.test('GET /status returns 200 with {"status":"ok"}', async () => {
    const res = await fetch(`${base}/status`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    assert.deepStrictEqual(await res.json(), { status: 'ok' });
  });

  await t.test('POST /status returns 405', async () => {
    const res = await fetch(`${base}/status`, { method: 'POST' });
    assert.strictEqual(res.status, 405);
    assert.strictEqual(res.headers.get('allow'), 'GET, HEAD');
  });

  await t.test('unknown path returns 404', async () => {
    const res = await fetch(`${base}/nope`);
    assert.strictEqual(res.status, 404);
  });
});
