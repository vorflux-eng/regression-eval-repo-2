const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

const app = require('../server');

let server;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /healthz returns a successful health status', async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/healthz`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), '{"status":"ok"}');
});
