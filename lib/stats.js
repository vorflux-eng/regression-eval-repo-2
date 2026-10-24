'use strict';

function mean(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('Expected an array of numbers');
  }
  if (values.length === 0) {
    throw new RangeError('Cannot compute the mean of an empty array');
  }
  let sum = 0;
  for (const value of values) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`Expected a finite number, got ${String(value)}`);
    }
    sum += value;
  }
  return sum / values.length;
}

module.exports = { mean };
