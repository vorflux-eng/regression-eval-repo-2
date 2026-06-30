const { test } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server');

function request(server, path) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    http
      .get({ host: '127.0.0.1', port, path }, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      })
      .on('error', reject);
  });
}

test('GET /healthz returns 200 with {"status":"ok"}', async () => {
  const server = app.listen(0);
  try {
    const res = await request(server, '/healthz');
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(res.body), { status: 'ok' });
  } finally {
    server.close();
  }
});
