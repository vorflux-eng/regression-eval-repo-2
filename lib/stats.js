'use strict';

function mean(numbers) {
  if (numbers.length === 0) {
    throw new RangeError('Cannot calculate the mean of an empty array');
  }

  const total = numbers.reduce((sum, number) => sum + number, 0);
  return total / numbers.length;
}

module.exports = { mean };
