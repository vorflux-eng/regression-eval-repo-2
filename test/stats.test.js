'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { mean } = require('../lib/stats');

test('mean returns the arithmetic mean', () => {
  assert.equal(mean([1, 2, 3, 4]), 2.5);
  assert.equal(mean([-2, 2]), 0);
  assert.equal(mean([0.5, 0.25, 0.75]), 0.5);
});

test('mean of a single value is that value', () => {
  assert.equal(mean([7]), 7);
});

test('mean throws on an empty array', () => {
  assert.throws(() => mean([]), RangeError);
});

test('mean rejects input that is not an array', () => {
  assert.throws(() => mean(undefined), TypeError);
  assert.throws(() => mean('123'), TypeError);
  assert.throws(() => mean(5), TypeError);
});

test('mean rejects non-finite or non-number elements', () => {
  assert.throws(() => mean([1, '2']), TypeError);
  assert.throws(() => mean([1, NaN]), TypeError);
  assert.throws(() => mean([1, Infinity]), TypeError);
  assert.throws(() => mean([1, null]), TypeError);
});
