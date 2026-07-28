const assert = require('node:assert/strict');
const http = require('node:http');
const { after, before, test } = require('node:test');

const { createServer } = require('../server');

let baseUrl;
let server;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

function requestRaw(path) {
  return new Promise((resolve, reject) => {
    const request = http.request(
      { host: '127.0.0.1', port: server.address().port, path },
      (response) => {
        response.resume();
        response.on('end', () => resolve(response));
      },
    );
    request.on('error', reject);
    request.end();
  });
}

test('GET /status returns an ok response', async () => {
  const response = await fetch(`${baseUrl}/status`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json');
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('GET /status accepts query parameters', async () => {
  const response = await fetch(`${baseUrl}/status?probe=1`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('unsupported requests return not found', async () => {
  const [unknownRoute, unsupportedMethod] = await Promise.all([
    fetch(`${baseUrl}/unknown`),
    fetch(`${baseUrl}/status`, { method: 'POST' }),
  ]);

  assert.equal(unknownRoute.status, 404);
  assert.equal(await unknownRoute.text(), '');
  assert.equal(unsupportedMethod.status, 404);
  assert.equal(await unsupportedMethod.text(), '');
});

test('malformed and scheme-relative request targets return bad request', async () => {
  const [malformed, schemeRelative] = await Promise.all([
    requestRaw('http://[/status'),
    requestRaw('//example.com/status'),
  ]);

  assert.equal(malformed.statusCode, 400);
  assert.equal(schemeRelative.statusCode, 400);
});
