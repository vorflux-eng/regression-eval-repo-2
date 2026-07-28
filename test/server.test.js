const assert = require('node:assert/strict');
const { test } = require('node:test');

const app = require('../server');

test('GET /healthz returns an ok status', async (testContext) => {
  const server = app.listen(0);
  testContext.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(`${url}/healthz`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
