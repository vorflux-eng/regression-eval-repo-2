const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');

test('GET /healthz returns 200 with {"status":"ok"}', async () => {
  const res = await request(app).get('/healthz');

  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /application\/json/);
  assert.deepEqual(res.body, { status: 'ok' });
});
