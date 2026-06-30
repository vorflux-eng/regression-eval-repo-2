const request = require('supertest');
const app = require('./server');

describe('GET /healthz', () => {
  it('returns ok status', async () => {
    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
