'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { createServer } = require('../server');

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test('GET /status returns 200 with ok status', async () => {
  const res = await fetch(`${baseUrl}/status`);
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.deepStrictEqual(await res.json(), { status: 'ok' });
});

test('POST /status returns 405', async () => {
  const res = await fetch(`${baseUrl}/status`, { method: 'POST' });
  assert.strictEqual(res.status, 405);
  assert.strictEqual(res.headers.get('allow'), 'GET, HEAD');
});

test('unknown path returns 404', async () => {
  const res = await fetch(`${baseUrl}/nope`);
  assert.strictEqual(res.status, 404);
});
