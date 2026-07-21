'use strict';

const sub = require('../sub');

describe('sub', () => {
  test('subtracts two positive numbers', () => {
    expect(sub(5, 3)).toBe(2);
  });

  test('subtracts to a negative result', () => {
    expect(sub(3, 5)).toBe(-2);
  });

  test('subtracts negative numbers', () => {
    expect(sub(-4, -6)).toBe(2);
  });

  test('subtracts zero as an identity', () => {
    expect(sub(42, 0)).toBe(42);
    expect(sub(0, 42)).toBe(-42);
  });

  test('handles floating point values', () => {
    expect(sub(0.3, 0.1)).toBeCloseTo(0.2);
  });

  test('throws a TypeError for non-number arguments', () => {
    expect(() => sub('5', 2)).toThrow(TypeError);
    expect(() => sub(5, null)).toThrow(TypeError);
  });
});
