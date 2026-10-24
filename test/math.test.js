'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { add, subtract, multiply, divide } = require('../lib/math');

test('add returns the sum', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1, 1), 0);
  assert.equal(add(0.5, 0.25), 0.75);
});

test('subtract returns the difference', () => {
  assert.equal(subtract(5, 3), 2);
  assert.equal(subtract(3, 5), -2);
});

test('multiply returns the product', () => {
  assert.equal(multiply(4, 3), 12);
  assert.equal(multiply(-2, 3), -6);
  assert.equal(multiply(7, 0), 0);
});

test('divide returns the quotient', () => {
  assert.equal(divide(10, 2), 5);
  assert.equal(divide(1, 4), 0.25);
});

test('divide throws RangeError on division by zero', () => {
  assert.throws(() => divide(1, 0), RangeError);
});

test('functions reject non-number input', () => {
  for (const fn of [add, subtract, multiply, divide]) {
    assert.throws(() => fn('1', 2), TypeError);
    assert.throws(() => fn(1, undefined), TypeError);
    assert.throws(() => fn(NaN, 1), TypeError);
  }
});
