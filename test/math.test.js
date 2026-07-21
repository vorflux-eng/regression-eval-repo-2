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

test('add supports decimal numbers', () => {
  assert.equal(add(1.25, 2.5), 3.75);
});
