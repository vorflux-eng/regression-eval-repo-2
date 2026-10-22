'use strict';
// Legacy monthly-rule coverage.
const test = require('node:test');
const assert = require('node:assert');
const { expandMonthlyByDay } = require('../src/recurrence');

test('second Friday', () => {
  assert.deepStrictEqual(expandMonthlyByDay('2026-01-01', { weekday: 5, nth: 2 }, 3), [
    '2026-01-09',
    '2026-02-13',
    '2026-03-13',
  ]);
});

test('first Monday when the month starts after Monday', () => {
  assert.deepStrictEqual(expandMonthlyByDay('2026-04-01', { weekday: 1, nth: 1 }, 2), [
    '2026-04-06',
    '2026-05-04',
  ]);
});

test('last Monday', () => {
  assert.deepStrictEqual(expandMonthlyByDay('2026-05-01', { weekday: 1, nth: -1 }, 2), [
    '2026-05-25',
    '2026-06-29',
  ]);
});

test('fifth Thursday skips months without one', () => {
  assert.deepStrictEqual(expandMonthlyByDay('2026-01-01', { weekday: 4, nth: 5 }, 3), [
    '2026-01-29',
    '2026-04-30',
    '2026-07-30',
  ]);
});

test('start date mid-month excludes earlier occurrences', () => {
  assert.deepStrictEqual(expandMonthlyByDay('2026-01-10', { weekday: 5, nth: 2 }, 1), ['2026-02-13']);
});
