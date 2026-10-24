'use strict';

function assertNumbers(...values) {
  for (const value of values) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new TypeError(`Expected a number, received ${String(value)}`);
    }
  }
}

function add(a, b) {
  assertNumbers(a, b);
  return a + b;
}

function subtract(a, b) {
  assertNumbers(a, b);
  return a - b;
}

function multiply(a, b) {
  assertNumbers(a, b);
  return a * b;
}

function divide(a, b) {
  assertNumbers(a, b);
  if (b === 0) {
    throw new RangeError('Division by zero');
  }
  return a / b;
}

module.exports = { add, subtract, multiply, divide };
