'use strict';

function assertFiniteNumbers(...values) {
  for (const value of values) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`Expected a finite number, got ${String(value)}`);
    }
  }
}

function add(a, b) {
  assertFiniteNumbers(a, b);
  return a + b;
}

function subtract(a, b) {
  assertFiniteNumbers(a, b);
  return a - b;
}

function multiply(a, b) {
  assertFiniteNumbers(a, b);
  return a * b;
}

function divide(a, b) {
  assertFiniteNumbers(a, b);
  if (b === 0) {
    throw new RangeError('Division by zero');
  }
  return a / b;
}

module.exports = { add, subtract, multiply, divide };
