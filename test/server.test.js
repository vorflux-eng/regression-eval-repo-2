const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');

const { createServer } = require('../server');

test('GET /status returns an OK status', async (t) => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());

  const { port } = server.address();
  for (const path of ['/status', '/status?probe=1']) {
    const response = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}${path}`, resolve).on('error', reject);
    });

    const body = await new Promise((resolve, reject) => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve(data));
      response.on('error', reject);
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['content-type'], 'application/json');
    assert.deepEqual(JSON.parse(body), { status: 'ok' });
  }
});
