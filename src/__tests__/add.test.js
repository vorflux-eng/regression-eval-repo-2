'use strict';

const add = require('../add');

describe('add', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(add(-4, -6)).toBe(-10);
  });

  test('adds a positive and a negative number', () => {
    expect(add(10, -3)).toBe(7);
  });

  test('adding zero returns the other operand', () => {
    expect(add(7, 0)).toBe(7);
  });

  test('throws when an argument is not a number', () => {
    expect(() => add('2', 3)).toThrow(TypeError);
    expect(() => add(2, null)).toThrow(TypeError);
  });
});
