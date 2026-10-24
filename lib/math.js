'use strict';

function assertFiniteNumbers(name, ...values) {
  for (const value of values) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`${name} expects finite numbers, got ${String(value)}`);
    }
  }
}

function add(a, b) {
  assertFiniteNumbers('add', a, b);
  return a + b;
}

function subtract(a, b) {
  assertFiniteNumbers('subtract', a, b);
  return a - b;
}

function multiply(a, b) {
  assertFiniteNumbers('multiply', a, b);
  return a * b;
}

function divide(a, b) {
  assertFiniteNumbers('divide', a, b);
  if (b === 0) {
    throw new RangeError('divide: division by zero');
  }
  return a / b;
}

module.exports = { add, subtract, multiply, divide };
