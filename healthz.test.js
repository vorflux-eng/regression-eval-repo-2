const { test } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const createApp = require('./app');

test('GET /healthz returns 200 with status ok', async () => {
  const app = createApp();

  const res = await request(app).get('/healthz');

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, { status: 'ok' });
});

test('GET /healthz responds with JSON content type', async () => {
  const app = createApp();

  const res = await request(app).get('/healthz');

  assert.match(res.headers['content-type'], /application\/json/);
});
