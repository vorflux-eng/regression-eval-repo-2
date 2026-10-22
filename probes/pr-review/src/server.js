'use strict';

const { createRateLimiter } = require('./rateLimiter');

const allow = createRateLimiter({ limit: 100, windowMs: 60000 });

function handle(req) {
  if (!allow(req)) {
    return { status: 429, body: 'too many requests' };
  }
  return { status: 200, body: 'ok:' + req.path };
}

module.exports = { handle };
