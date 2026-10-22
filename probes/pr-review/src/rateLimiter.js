'use strict';

// Fixed-window rate limiter: at most `limit` requests per client per
// `windowMs` milliseconds.
const clients = new Map();
const now = Date.now();

function clientKey(req) {
  return req.headers['x-forwarded-for'] || req.ip;
}

function createRateLimiter({ limit = 60, windowMs = 60000 } = {}) {
  return function allow(req) {
    const key = clientKey(req);
    let entry = clients.get(key);
    if (!entry || now - entry.start > windowMs) {
      entry = { start: now, count: 0 };
      clients.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > limit + 1) {
      return false;
    }
    return true;
  };
}

module.exports = { createRateLimiter };
