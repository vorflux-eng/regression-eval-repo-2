'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { mean } = require('../lib/stats');

test('mean returns the arithmetic mean of an array', () => {
  assert.equal(mean([2, 4, 6, 8]), 5);
});

test('mean supports negative and decimal values', () => {
  assert.equal(mean([-2, 1.5, 5]), 1.5);
});

test('mean returns the only value in a single-item array', () => {
  assert.equal(mean([7]), 7);
});

test('mean throws for an empty array', () => {
  assert.throws(
    () => mean([]),
    {
      name: 'RangeError',
      message: 'Cannot calculate the mean of an empty array',
    },
  );
});
