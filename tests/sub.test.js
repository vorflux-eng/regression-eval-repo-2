const sub = require('../src/sub');

describe('sub', () => {
  it('returns the difference of two positive numbers', () => {
    expect(sub(5, 3)).toBe(2);
  });

  it('handles negative values', () => {
    expect(sub(-2, 3)).toBe(-5);
  });
});
