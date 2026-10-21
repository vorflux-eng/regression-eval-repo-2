const assert = require('node:assert/strict');
const test = require('node:test');

const server = require('./server');

test('GET /status returns ok', async (t) => {
  server.listen(0);
  t.after(() => server.close());

  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/status`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
