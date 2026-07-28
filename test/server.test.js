const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

const app = require('../server');

let server;

before(async () => {
  server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /healthz returns a successful health response', async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/healthz`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
  assert.deepEqual(await response.json(), { status: 'ok' });
});
