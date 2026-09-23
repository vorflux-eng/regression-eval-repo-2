const add = require('../src/add');

describe('add', () => {
  test.each([
    [2, 3, 5],
    [-2, -3, -5],
    [-2, 3, 1],
    [2, -3, -1],
    [0, 5, 5],
    [5, 0, 5],
    [0, 0, 0],
  ])('add(%s, %s) returns %s', (a, b, expected) => {
    expect(add(a, b)).toBe(expected);
  });

  test('adds decimal numbers', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});
