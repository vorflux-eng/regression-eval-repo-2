'use strict';

/**
 * Returns the sum of two numbers.
 *
 * @param {number} a - The first addend.
 * @param {number} b - The second addend.
 * @returns {number} The sum of `a` and `b`.
 * @throws {TypeError} If either argument is not a number.
 */
function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('add expects two numbers');
  }
  return a + b;
}

module.exports = add;
