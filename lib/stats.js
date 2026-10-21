'use strict';

/**
 * Calculate the arithmetic mean of a list of numbers.
 *
 * @param {number[]} values - The numbers to average.
 * @returns {number} The arithmetic mean, or NaN when the list is empty.
 */
function mean(values) {
  const total = values.reduce((sum, value) => sum + value, 0);

  return total / values.length;
}

module.exports = { mean };
