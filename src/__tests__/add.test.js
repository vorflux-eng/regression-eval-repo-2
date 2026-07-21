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

  test('adds zero as an identity', () => {
    expect(add(0, 0)).toBe(0);
    expect(add(42, 0)).toBe(42);
  });

  test('handles floating point values', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });

  test('throws a TypeError for non-number arguments', () => {
    expect(() => add('1', 2)).toThrow(TypeError);
    expect(() => add(1, undefined)).toThrow(TypeError);
  });
});
