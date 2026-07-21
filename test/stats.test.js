'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { mean } = require('../lib/stats');

test('mean returns the average of positive numbers', () => {
  assert.equal(mean([2, 4, 6]), 4);
});

test('mean supports negative and decimal numbers', () => {
  assert.equal(mean([-2, 1.5, 5]), 1.5);
});

test('mean returns NaN for an empty array', () => {
  assert.equal(Number.isNaN(mean([])), true);
});
