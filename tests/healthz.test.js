const request = require('supertest');
const app = require('../src/app');

describe('GET /healthz', () => {
  it('returns 200 with {"status":"ok"} as JSON', async () => {
    const res = await request(app).get('/healthz');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/does-not-exist');

    expect(res.status).toBe(404);
  });
});
