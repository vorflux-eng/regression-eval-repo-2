'use strict';

function mean(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('values must be an array');
  }
  if (values.length === 0) {
    throw new RangeError('mean of an empty array is undefined');
  }
  let sum = 0;
  for (const value of values) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError('values must contain only finite numbers');
    }
    sum += value;
  }
  return sum / values.length;
}

module.exports = { mean };
