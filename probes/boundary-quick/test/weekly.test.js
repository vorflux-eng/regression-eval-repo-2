'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { expandWeekly } = require('../src/recurrence');

test('weekly expansion', () => {
  assert.deepStrictEqual(expandWeekly('2026-03-02', 3), ['2026-03-02', '2026-03-09', '2026-03-16']);
});

test('biweekly expansion crosses a month boundary', () => {
  assert.deepStrictEqual(expandWeekly('2026-01-26', 3, 2), ['2026-01-26', '2026-02-09', '2026-02-23']);
});
