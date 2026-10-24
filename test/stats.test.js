'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { mean } = require('../lib/stats');

test('mean returns the arithmetic mean of the values', () => {
  assert.equal(mean([1, 2, 3, 4]), 2.5);
  assert.equal(mean([-3, 3]), 0);
  assert.equal(mean([0.5, 1.5]), 1);
});

test('mean of a single value is that value', () => {
  assert.equal(mean([7]), 7);
});

test('mean does not modify the input array', () => {
  const values = [3, 1, 2];
  mean(values);
  assert.deepEqual(values, [3, 1, 2]);
});

test('mean throws RangeError for an empty array', () => {
  assert.throws(() => mean([]), RangeError);
});

test('mean throws TypeError when the input is not an array', () => {
  assert.throws(() => mean(undefined), TypeError);
  assert.throws(() => mean('123'), TypeError);
  assert.throws(() => mean({ length: 1, 0: 1 }), TypeError);
});

test('mean throws TypeError for non-number or non-finite elements', () => {
  assert.throws(() => mean([1, '2']), TypeError);
  assert.throws(() => mean([1, NaN]), TypeError);
  assert.throws(() => mean([1, Infinity]), TypeError);
  assert.throws(() => mean([1, undefined]), TypeError);
});
