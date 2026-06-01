const test = require('node:test');
const request = require('supertest');

const app = require('../app');

test('GET /healthz returns ok JSON status', async () => {
  await request(app)
    .get('/healthz')
    .expect('Content-Type', /application\/json/)
    .expect(200)
    .expect({ status: 'ok' });
});

test('unsupported routes and methods return 404', async () => {
  await request(app).get('/unknown').expect(404);
  await request(app).post('/healthz').expect(404);
});
