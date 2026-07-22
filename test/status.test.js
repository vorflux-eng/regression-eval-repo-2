const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../server');

test('GET /status returns 200 and status ok', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/status`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.deepStrictEqual(body, { status: 'ok' });
  } finally {
    server.close();
  }
});
