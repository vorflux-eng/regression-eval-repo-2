'use strict';

/**
 * Returns the difference of two numbers.
 *
 * @param {number} a - The minuend.
 * @param {number} b - The subtrahend.
 * @returns {number} The result of `a - b`.
 * @throws {TypeError} If either argument is not a number.
 */
function sub(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('sub expects two numbers');
  }
  return a - b;
}

module.exports = sub;
