'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { mean } = require('../lib/stats');

test('mean returns the arithmetic mean of an array', () => {
  assert.equal(mean([1, 2, 3, 4]), 2.5);
  assert.equal(mean([-3, 3]), 0);
  assert.equal(mean([0.5, 1.5]), 1);
});

test('mean of a single value is that value', () => {
  assert.equal(mean([7]), 7);
});

test('mean throws RangeError on an empty array', () => {
  assert.throws(() => mean([]), RangeError);
});

test('mean throws TypeError when input is not an array', () => {
  assert.throws(() => mean(), TypeError);
  assert.throws(() => mean(5), TypeError);
  assert.throws(() => mean('1,2,3'), TypeError);
});

test('mean throws TypeError on non-finite or non-number elements', () => {
  assert.throws(() => mean([1, '2']), TypeError);
  assert.throws(() => mean([1, NaN]), TypeError);
  assert.throws(() => mean([1, Infinity]), TypeError);
  assert.throws(() => mean([1, undefined]), TypeError);
});
