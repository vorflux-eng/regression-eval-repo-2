'use strict';

function mean(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('values must be an array');
  }
  if (values.length === 0) {
    throw new RangeError('Cannot compute the mean of an empty array');
  }
  let sum = 0;
  values.forEach((value, index) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`values[${index}] must be a finite number`);
    }
    sum += value;
  });
  return sum / values.length;
}

module.exports = { mean };
