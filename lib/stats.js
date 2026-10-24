'use strict';

function mean(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('mean expects an array of numbers');
  }
  if (values.length === 0) {
    throw new RangeError('mean: cannot compute the mean of an empty array');
  }
  let sum = 0;
  for (const value of values) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`mean expects finite numbers, got ${String(value)}`);
    }
    sum += value;
  }
  return sum / values.length;
}

module.exports = { mean };
