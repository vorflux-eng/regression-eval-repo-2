'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { add, subtract } = require('../lib/math');

test('add returns the sum of two numbers', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-2, 3), 1);
  assert.equal(add(0, 0), 0);
});

test('subtract returns the difference between two numbers', () => {
  assert.equal(subtract(5, 3), 2);
  assert.equal(subtract(-2, 3), -5);
  assert.equal(subtract(0, 0), 0);
});
