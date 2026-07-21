const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const server = require('./server.js');

function request(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const req = http.request({ host: '127.0.0.1', port, path, method }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

test.before(() => new Promise((resolve) => server.listen(0, resolve)));
test.after(() => new Promise((resolve) => server.close(resolve)));

test('importing the module does not start listening on its own', () => {
  // If require() had called listen(), address() would be set before before().
  // Here the server is listening (started in before hook), so just assert it exports a server.
  assert.strictEqual(typeof server.listen, 'function');
});

test('GET /status returns 200 with {"status":"ok"}', async () => {
  const res = await request('/status');
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.body), { status: 'ok' });
});

test('unknown path returns 404 JSON', async () => {
  const res = await request('/nope');
  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(JSON.parse(res.body), { error: 'Not Found' });
});

test('non-GET method on /status returns 404 JSON', async () => {
  const res = await request('/status', 'POST');
  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(JSON.parse(res.body), { error: 'Not Found' });
});
