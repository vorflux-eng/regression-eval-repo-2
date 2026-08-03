const assert = require('node:assert/strict');
const test = require('node:test');
const request = require('supertest');

const app = require('../app');

test('GET /healthz returns 200 with {"status":"ok"}', async () => {
  const res = await request(app).get('/healthz');

  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});
