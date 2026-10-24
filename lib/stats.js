'use strict';

/**
 * Basic statistics utilities.
 */

/**
 * Returns the arithmetic mean of an array of finite numbers.
 * Throws TypeError if the input is not an array of finite numbers.
 * Throws RangeError if the array is empty.
 */
function mean(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('values must be an array');
  }
  if (values.length === 0) {
    throw new RangeError('Cannot compute the mean of an empty array');
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
