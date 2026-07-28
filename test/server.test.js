const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

const { createServer } = require('../server');

let baseUrl;
let server;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /status returns the service status', async () => {
  const response = await fetch(`${baseUrl}/status`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('other routes return 404', async () => {
  const response = await fetch(`${baseUrl}/missing`);

  assert.equal(response.status, 404);
});

test('non-GET requests to /status return 404', async () => {
  const response = await fetch(`${baseUrl}/status`, { method: 'POST' });

  assert.equal(response.status, 404);
});
