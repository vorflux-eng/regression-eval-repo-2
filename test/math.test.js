'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { add, subtract, multiply, divide } = require('../lib/math');

test('add sums two numbers', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1, 1), 0);
});

test('subtract returns the difference', () => {
  assert.equal(subtract(5, 3), 2);
  assert.equal(subtract(0, 4), -4);
});

test('multiply returns the product', () => {
  assert.equal(multiply(4, 3), 12);
  assert.equal(multiply(-2, 3), -6);
});

test('divide returns the quotient', () => {
  assert.equal(divide(10, 2), 5);
  assert.equal(divide(-6, 3), -2);
});

test('divide by zero throws', () => {
  assert.throws(() => divide(1, 0), /Division by zero/);
});
