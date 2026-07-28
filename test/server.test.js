const assert = require('node:assert/strict');
const http = require('node:http');
const { after, before, test } = require('node:test');

const { handleRequest } = require('../server');

let server;
let baseUrl;

before(async () => {
  server = http.createServer(handleRequest);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /status reports that the service is healthy', async () => {
  const response = await fetch(`${baseUrl}/status?probe=1`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json');
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('unknown routes return 404', async () => {
  const response = await fetch(`${baseUrl}/unknown`);

  assert.equal(response.status, 404);
  assert.equal(response.headers.get('content-type'), 'application/json');
  assert.deepEqual(await response.json(), { error: 'not found' });
});
