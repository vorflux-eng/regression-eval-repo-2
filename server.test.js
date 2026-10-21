const assert = require('node:assert/strict');
const net = require('node:net');
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
  assert.match(response.headers.get('content-type'), /^application\/json\b/);
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

test('malformed request targets do not stop the server', async () => {
  const { port } = server.address();
  const rawResponse = await new Promise((resolve, reject) => {
    const socket = net.createConnection(port, '127.0.0.1', () => {
      socket.end('GET //[ HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n');
    });
    let data = '';

    socket.setEncoding('utf8');
    socket.on('data', (chunk) => { data += chunk; });
    socket.on('end', () => resolve(data));
    socket.on('error', reject);
  });

  assert.match(rawResponse, /^HTTP\/1\.1 404/);
  assert.equal((await fetch(`http://127.0.0.1:${port}/status`)).status, 200);
});
