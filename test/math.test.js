'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { add, subtract, multiply, divide } = require('../lib/math');

test('add returns the sum of two numbers', () => {
  assert.equal(add(2, 3), 5);
});

test('subtract returns the difference between two numbers', () => {
  assert.equal(subtract(7, 4), 3);
});

test('multiply returns the product of two numbers', () => {
  assert.equal(multiply(6, 5), 30);
});

test('divide returns the quotient of two numbers', () => {
  assert.equal(divide(8, 2), 4);
});

test('divide throws when the divisor is zero', () => {
  assert.throws(
    () => divide(8, 0),
    { name: 'RangeError', message: 'Cannot divide by zero' },
  );
});
