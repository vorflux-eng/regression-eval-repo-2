'use strict';

/**
 * Statistics utilities.
 * All source lives under lib/ per repository convention.
 */

/**
 * Compute the arithmetic mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 * @throws {TypeError} when input is not a non-empty array of numbers
 */
function mean(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError('mean requires a non-empty array of numbers');
  }
  let sum = 0;
  for (const value of values) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new TypeError('All values must be numbers');
    }
    sum += value;
  }
  return sum / values.length;
}

module.exports = { mean };
