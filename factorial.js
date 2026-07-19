/**
 * Computes the factorial of a non-negative integer.
 *
 * @param {number} n - A non-negative integer.
 * @returns {number} n! (the product of all positive integers up to n).
 * @throws {TypeError} If n is not an integer.
 * @throws {RangeError} If n is negative.
 */
function factorial(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('factorial expects an integer');
  }
  if (n < 0) {
    throw new RangeError('factorial is not defined for negative numbers');
  }

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

module.exports = factorial;
