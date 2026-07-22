'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { mean } = require('./stats');

test('mean of positive numbers', () => {
  assert.equal(mean([2, 4, 6]), 4);
});

test('mean with negatives', () => {
  assert.equal(mean([-2, 0, 2]), 0);
});

test('mean of a single element', () => {
  assert.equal(mean([5]), 5);
});

test('mean rejects empty array', () => {
  assert.throws(() => mean([]), TypeError);
});

test('mean rejects non-array input', () => {
  assert.throws(() => mean(42), TypeError);
});

test('mean rejects non-numeric values', () => {
  assert.throws(() => mean([1, '2', 3]), TypeError);
  assert.throws(() => mean([1, NaN]), TypeError);
});
