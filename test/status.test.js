const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

const server = require('../server');

before(async () => {
  await new Promise((resolve) => server.listen(0, resolve));
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /status returns the service status', async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/status`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json');
  assert.deepEqual(await response.json(), { status: 'ok' });
});
