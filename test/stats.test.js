'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { mean } = require('../lib/stats');

test('mean returns the arithmetic mean', () => {
  assert.equal(mean([2, 4, 6]), 4);
});

test('mean supports negative numbers', () => {
  assert.equal(mean([-6, 2, 4]), 0);
});

test('mean returns the only value in a single-item list', () => {
  assert.equal(mean([7]), 7);
});

test('mean returns NaN for an empty list', () => {
  assert.ok(Number.isNaN(mean([])));
});
