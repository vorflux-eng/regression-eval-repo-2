'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { mean } = require('./stats');

test('mean', () => {
  assert.strictEqual(mean([2, 4, 6]), 4);
  assert.strictEqual(mean([5]), 5);
  assert.strictEqual(mean([-2, 2]), 0);
});

test('mean throws on empty or invalid input', () => {
  assert.throws(() => mean([]), /non-empty array/);
  assert.throws(() => mean('nope'), /non-empty array/);
});
