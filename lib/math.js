'use strict';

/**
 * Basic math utilities.
 * All source lives under lib/ per repository convention.
 */

/**
 * Add two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  assertNumbers(a, b);
  return a + b;
}

/**
 * Subtract b from a.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtract(a, b) {
  assertNumbers(a, b);
  return a - b;
}

/**
 * Multiply two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiply(a, b) {
  assertNumbers(a, b);
  return a * b;
}

/**
 * Divide a by b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 * @throws {RangeError} when dividing by zero
 */
function divide(a, b) {
  assertNumbers(a, b);
  if (b === 0) {
    throw new RangeError('Division by zero');
  }
  return a / b;
}

/**
 * @param {...number} values
 * @throws {TypeError} when any value is not a finite number
 */
function assertNumbers(...values) {
  for (const value of values) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new TypeError('Arguments must be numbers');
    }
  }
}

module.exports = { add, subtract, multiply, divide };
