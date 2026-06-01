const test = require('node:test');
const request = require('supertest');
const app = require('./server');

test('GET /healthz returns ok status', async () => {
  await request(app)
    .get('/healthz')
    .expect(200)
    .expect({ status: 'ok' });
});
