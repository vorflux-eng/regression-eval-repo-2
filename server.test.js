const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

const server = require('./server');

before(() => new Promise((resolve) => server.listen(0, resolve)));
after(() => new Promise((resolve) => server.close(resolve)));

test('GET /status returns an ok status', async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/status`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json\b/);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('GET /status accepts query parameters', async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/status?probe=1`);

  assert.equal(response.status, 200);
});

test('HEAD /status returns the endpoint headers without a body', async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/status`, { method: 'HEAD' });

  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});

test('unsupported methods return 405 with allowed methods', async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/status`, { method: 'POST' });

  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});

test('unknown paths return 404', async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/unknown`);

  assert.equal(response.status, 404);
});
