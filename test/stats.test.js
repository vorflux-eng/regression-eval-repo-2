'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { mean } = require('../lib/stats');

test('mean of a list of numbers', () => {
  assert.equal(mean([1, 2, 3, 4]), 2.5);
  assert.equal(mean([10]), 10);
});

test('mean handles negatives', () => {
  assert.equal(mean([-2, 2]), 0);
  assert.equal(mean([-4, -6]), -5);
});

test('mean of empty array throws', () => {
  assert.throws(() => mean([]), /empty array/);
});

test('mean rejects non-array input', () => {
  assert.throws(() => mean(42), TypeError);
});
