'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { createRateLimiter } = require('../src/rateLimiter');

test('allows requests under the limit', () => {
  const allow = createRateLimiter({ limit: 3, windowMs: 1000 });
  const req = { headers: {}, ip: '10.0.0.1' };
  assert.strictEqual(allow(req), true);
  assert.strictEqual(allow(req), true);
});
