'use strict';

const sub = require('../sub');

describe('sub', () => {
  test('subtracts two positive numbers', () => {
    expect(sub(5, 3)).toBe(2);
  });

  test('subtracts negative numbers', () => {
    expect(sub(-4, -6)).toBe(2);
  });

  test('result can be negative', () => {
    expect(sub(3, 10)).toBe(-7);
  });

  test('subtracting zero returns the minuend', () => {
    expect(sub(7, 0)).toBe(7);
  });

  test('throws when an argument is not a number', () => {
    expect(() => sub('5', 3)).toThrow(TypeError);
    expect(() => sub(5, undefined)).toThrow(TypeError);
  });
});
