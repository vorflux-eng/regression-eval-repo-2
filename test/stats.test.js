'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { mean } = require('../lib/stats');

test('mean returns the average of the values', () => {
  assert.equal(mean([1, 2, 3, 4]), 2.5);
  assert.equal(mean([5]), 5);
  assert.equal(mean([-2, 2]), 0);
  assert.equal(mean([1.5, 2.5]), 2);
});

test('mean throws on an empty array', () => {
  assert.throws(() => mean([]), RangeError);
});

test('mean rejects input that is not an array', () => {
  assert.throws(() => mean(undefined), TypeError);
  assert.throws(() => mean('123'), TypeError);
  assert.throws(() => mean(3), TypeError);
});

test('mean rejects non-finite or non-number elements', () => {
  assert.throws(() => mean([1, '2']), TypeError);
  assert.throws(() => mean([1, NaN]), TypeError);
  assert.throws(() => mean([1, Infinity]), TypeError);
  assert.throws(() => mean([1, undefined]), TypeError);
});
