'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { add, subtract, multiply, divide } = require('../lib/math');

test('add returns the sum', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-2, 3), 1);
  assert.equal(add(0.1, 0.2), 0.1 + 0.2);
});

test('subtract returns the difference', () => {
  assert.equal(subtract(5, 3), 2);
  assert.equal(subtract(3, 5), -2);
});

test('multiply returns the product', () => {
  assert.equal(multiply(4, 3), 12);
  assert.equal(multiply(-4, 3), -12);
  assert.equal(multiply(7, 0), 0);
});

test('divide returns the quotient', () => {
  assert.equal(divide(12, 3), 4);
  assert.equal(divide(1, 4), 0.25);
  assert.equal(divide(-9, 3), -3);
});

test('divide throws RangeError on division by zero', () => {
  assert.throws(() => divide(1, 0), RangeError);
});

test('functions reject non-finite or non-number inputs', () => {
  for (const fn of [add, subtract, multiply, divide]) {
    assert.throws(() => fn('1', 2), TypeError);
    assert.throws(() => fn(1, undefined), TypeError);
    assert.throws(() => fn(NaN, 1), TypeError);
    assert.throws(() => fn(1, Infinity), TypeError);
  }
});
