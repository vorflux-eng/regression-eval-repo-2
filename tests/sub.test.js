const sub = require('../src/sub');

describe('sub', () => {
  test('subtracts two positive numbers', () => {
    expect(sub(5, 3)).toBe(2);
  });

  test('subtracts a negative number', () => {
    expect(sub(5, -3)).toBe(8);
  });

  test('subtracts zero', () => {
    expect(sub(7, 0)).toBe(7);
  });
});
