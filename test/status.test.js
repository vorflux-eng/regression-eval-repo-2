'use strict';

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { handler } = require('../server');

test('GET /status', async (t) => {
  const server = http.createServer(handler).listen(0);
  t.after(() => server.close());
  const base = `http://localhost:${server.address().port}`;

  const ok = await fetch(`${base}/status`);
  assert.strictEqual(ok.status, 200);
  assert.deepStrictEqual(await ok.json(), { status: 'ok' });

  const post = await fetch(`${base}/status`, { method: 'POST' });
  assert.strictEqual(post.status, 405);

  const missing = await fetch(`${base}/nope`);
  assert.strictEqual(missing.status, 404);
});
