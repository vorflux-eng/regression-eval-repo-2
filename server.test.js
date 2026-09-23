const assert = require('node:assert/strict');
const { once } = require('node:events');
const test = require('node:test');
const app = require('./server');

test('GET /healthz returns HTTP 200 and status ok', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, 'listening');

  const response = await fetch(`http://127.0.0.1:${server.address().port}/healthz`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json\b/);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
