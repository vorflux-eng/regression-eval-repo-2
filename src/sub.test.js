const sub = require('./sub');

describe('sub', () => {
  test('subtracts the second number from the first', () => {
    expect(sub(5, 3)).toBe(2);
  });

  test('returns a negative result when appropriate', () => {
    expect(sub(3, 5)).toBe(-2);
  });
});
