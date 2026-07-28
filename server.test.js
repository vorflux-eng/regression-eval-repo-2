const assert = require('node:assert/strict');
const http = require('node:http');
const { after, before, test } = require('node:test');

const { server } = require('./server');

before((done) => server.listen(0, '127.0.0.1', done));
after((done) => server.close(done));

function request(path) {
  const { port } = server.address();

  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => resolve({ response, body }));
    }).on('error', reject);
  });
}

test('GET /status returns an ok status', async () => {
  const { response, body } = await request('/status');

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-type'], 'application/json');
  assert.deepEqual(JSON.parse(body), { status: 'ok' });
});

test('GET /status accepts query parameters', async () => {
  const { response, body } = await request('/status?probe=1');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(body), { status: 'ok' });
});

test('unknown routes return 404', async () => {
  const { response, body } = await request('/missing');

  assert.equal(response.statusCode, 404);
  assert.equal(body, '');
});
