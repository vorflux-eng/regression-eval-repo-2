const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../server');

test('GET /healthz returns 200 with {status: "ok"}', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/healthz`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.deepStrictEqual(body, { status: 'ok' });
  } finally {
    server.close();
  }
});
