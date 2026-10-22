const { add } = require('../lib/math');

test('add returns the sum of two positive numbers', () => {
  expect(add(2, 3)).toBe(5);
});

test('add supports negative numbers', () => {
  expect(add(-2, -3)).toBe(-5);
});

test('add supports zero', () => {
  expect(add(7, 0)).toBe(7);
});
