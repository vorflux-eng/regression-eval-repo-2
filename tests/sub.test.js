const sub = require('../src/sub');

describe('sub', () => {
  test.each([
    [5, 3, 2],
    [3, 5, -2],
    [-5, -3, -2],
    [-2, 3, -5],
    [2, -3, 5],
    [0, 5, -5],
    [5, 0, 5],
    [0, 0, 0],
    [5, 5, 0],
  ])('sub(%s, %s) returns %s', (a, b, expected) => {
    expect(sub(a, b)).toBe(expected);
  });

  test('subtracts decimal numbers', () => {
    expect(sub(0.3, 0.1)).toBeCloseTo(0.2);
  });
});
