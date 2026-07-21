const assert = require('node:assert/strict');
const { once } = require('node:events');
const test = require('node:test');
const app = require('./server');

test('GET /healthz returns the health status', async (t) => {
  const server = app.listen(0);
  await once(server, 'listening');
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/healthz`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
