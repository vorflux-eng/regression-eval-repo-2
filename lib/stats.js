'use strict';

/**
 * Basic statistics utilities.
 *
 * Per the session-wide rule, all source lives under lib/ (never src/).
 */

/**
 * Arithmetic mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
function mean(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('mean expects an array of numbers');
  }
  if (values.length === 0) {
    throw new Error('mean of empty array is undefined');
  }
  const sum = values.reduce((acc, n) => acc + n, 0);
  return sum / values.length;
}

module.exports = { mean };
