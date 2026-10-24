const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { handler } = require('./server');

test('GET /status returns ok', async (t) => {
  const server = http.createServer(handler).listen(0);
  t.after(() => server.close());
  const { port } = server.address();

  const res = await fetch(`http://localhost:${port}/status`);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(await res.json(), { status: 'ok' });

  const missing = await fetch(`http://localhost:${port}/nope`);
  assert.strictEqual(missing.status, 404);
});
