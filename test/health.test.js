const assert = require('assert');
const http = require('http');
const app = require('../server');

const server = app.listen(0, () => {
  const { port } = server.address();

  http.get(`http://127.0.0.1:${port}/healthz`, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      try {
        assert.strictEqual(res.statusCode, 200, 'expected status code 200');
        assert.strictEqual(
          res.headers['content-type'] && res.headers['content-type'].includes('application/json'),
          true,
          'expected JSON content-type'
        );
        assert.deepStrictEqual(JSON.parse(body), { status: 'ok' }, 'expected {"status":"ok"} body');
        console.log('PASS: GET /healthz returns 200 {"status":"ok"}');
        server.close(() => process.exit(0));
      } catch (err) {
        console.error(`FAIL: ${err.message}`);
        server.close(() => process.exit(1));
      }
    });
  }).on('error', (err) => {
    console.error(`FAIL: request error ${err.message}`);
    server.close(() => process.exit(1));
  });
});
