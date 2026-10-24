const test = require('node:test');
const assert = require('node:assert');
const { createServer } = require('./server');

async function withServer(fn) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const base = `http://localhost:${server.address().port}`;
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

test('POST /status returns 404', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/status`, { method: 'POST' });
    assert.strictEqual(res.status, 404);
  }));

test('unknown path returns 404', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/nope`);
    assert.strictEqual(res.status, 404);
  }));
