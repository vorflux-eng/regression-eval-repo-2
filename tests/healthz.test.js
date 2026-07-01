const request = require('supertest');
const app = require('../src/app');

describe('health check', () => {
  it('GET /healthz should return 200 and status ok', async () => {
    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('GET /unknown should return 404', async () => {
    const response = await request(app).get('/unknown');

    expect(response.status).toBe(404);
  });
});
