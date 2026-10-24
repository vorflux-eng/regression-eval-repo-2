'use strict';

const { add, divide } = require('./math');

function mean(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('values must be an array');
  }
  if (values.length === 0) {
    throw new RangeError('mean requires at least one value');
  }
  // add() validates that every element is a finite number.
  const sum = values.reduce((total, value) => add(total, value), 0);
  return divide(sum, values.length);
}

module.exports = { mean };
