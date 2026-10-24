'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { mean } = require('../lib/stats');

test('mean returns the average of the values', () => {
  assert.equal(mean([1, 2, 3, 4]), 2.5);
  assert.equal(mean([10]), 10);
  assert.equal(mean([-3, 3]), 0);
  assert.equal(mean([0.5, 1.5]), 1);
});

test('mean throws RangeError for an empty array', () => {
  assert.throws(() => mean([]), RangeError);
});

test('mean throws TypeError when the input is not an array', () => {
  assert.throws(() => mean(), TypeError);
  assert.throws(() => mean('123'), TypeError);
  assert.throws(() => mean({ length: 1, 0: 1 }), TypeError);
});

test('mean throws TypeError for non-number or non-finite values', () => {
  assert.throws(() => mean([1, '2']), TypeError);
  assert.throws(() => mean([1, NaN]), TypeError);
  assert.throws(() => mean([1, Infinity]), TypeError);
  assert.throws(() => mean([1, undefined]), TypeError);
});
