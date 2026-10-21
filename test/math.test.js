'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { add } = require('../lib/math');

test('add returns the sum of two positive numbers', () => {
  assert.equal(add(2, 3), 5);
});

test('add supports negative numbers', () => {
  assert.equal(add(-4, -6), -10);
});

test('add supports zero', () => {
  assert.equal(add(7, 0), 7);
});
