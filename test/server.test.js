const assert = require('node:assert/strict');
const test = require('node:test');

const app = require('../server');

test('GET /healthz returns an ok status', async (context) => {
  const server = app.listen(0);
  context.after(() => server.close());

  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/healthz`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
