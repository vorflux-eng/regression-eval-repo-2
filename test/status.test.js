'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createServer } = require('../server');

async function withServer(fn) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('GET /status returns 200 with {"status":"ok"}', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/status`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    assert.deepStrictEqual(await res.json(), { status: 'ok' });
  }));

test('GET /status with query string returns 200', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/status?x=1`);
    assert.strictEqual(res.status, 200);
  }));

test('POST /status returns 405', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/status`, { method: 'POST' });
    assert.strictEqual(res.status, 405);
    assert.strictEqual(res.headers.get('allow'), 'GET');
  }));

test('unknown path returns 404', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/nope`);
    assert.strictEqual(res.status, 404);
  }));
