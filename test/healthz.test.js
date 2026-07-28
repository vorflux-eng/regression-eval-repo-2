const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

const app = require('../server');

let server;
let baseUrl;

before(() => {
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => new Promise((resolve, reject) => {
  server.close((error) => (error ? reject(error) : resolve()));
}));

test('GET /healthz returns an OK health status', async () => {
  const response = await fetch(`${baseUrl}/healthz`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
