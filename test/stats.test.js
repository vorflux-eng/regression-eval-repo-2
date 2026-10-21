'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { mean } = require('../lib/stats');

test('mean returns the arithmetic mean', () => {
  assert.equal(mean([2, 4, 6]), 4);
  assert.equal(mean([-2, 2]), 0);
  assert.equal(mean([1.5, 2.5]), 2);
});

test('mean rejects an empty array', () => {
  assert.throws(
    () => mean([]),
    (error) => error instanceof RangeError && error.message === 'mean requires at least one value',
  );
});
