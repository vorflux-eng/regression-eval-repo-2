'use strict';

function mean(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('values must be an array');
  }
  if (values.length === 0) {
    throw new RangeError('values must not be empty');
  }
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`values[${i}] must be a finite number`);
    }
    sum += value;
  }
  return sum / values.length;
}

module.exports = { mean };
