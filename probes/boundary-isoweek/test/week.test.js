'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { weekNumber } = require('../src/week');

const d = (s) => new Date(s + 'T12:00:00Z');

test('mid-year dates', () => {
  assert.strictEqual(weekNumber(d('2026-06-15')), 25);
  assert.strictEqual(weekNumber(d('2026-03-04')), 10);
});

test('first days of January', () => {
  assert.strictEqual(weekNumber(d('2026-01-01')), 1);
  assert.strictEqual(weekNumber(d('2027-01-01')), 53);
  assert.strictEqual(weekNumber(d('2021-01-03')), 53);
});

test('last days of December', () => {
  assert.strictEqual(weekNumber(d('2024-12-30')), 1);
  assert.strictEqual(weekNumber(d('2026-12-31')), 53);
});
