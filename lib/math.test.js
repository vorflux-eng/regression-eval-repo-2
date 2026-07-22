'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { add, subtract, multiply, divide } = require('./math');

test('add', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1, 1), 0);
});

test('subtract', () => {
  assert.equal(subtract(5, 3), 2);
  assert.equal(subtract(0, 4), -4);
});

test('multiply', () => {
  assert.equal(multiply(4, 3), 12);
  assert.equal(multiply(-2, 3), -6);
});

test('divide', () => {
  assert.equal(divide(10, 2), 5);
  assert.throws(() => divide(1, 0), RangeError);
});

test('rejects non-numeric input', () => {
  assert.throws(() => add('1', 2), TypeError);
  assert.throws(() => multiply(2, NaN), TypeError);
});
