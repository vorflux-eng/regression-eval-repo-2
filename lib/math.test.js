'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { add, subtract, multiply, divide } = require('./math');

test('add', () => {
  assert.strictEqual(add(2, 3), 5);
  assert.strictEqual(add(-1, 1), 0);
});

test('subtract', () => {
  assert.strictEqual(subtract(5, 3), 2);
  assert.strictEqual(subtract(0, 4), -4);
});

test('multiply', () => {
  assert.strictEqual(multiply(4, 3), 12);
  assert.strictEqual(multiply(-2, 3), -6);
});

test('divide', () => {
  assert.strictEqual(divide(10, 2), 5);
  assert.throws(() => divide(1, 0), /Division by zero/);
});
