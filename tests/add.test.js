const add = require('../src/add');

describe('add', () => {
  it('returns the sum of two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('handles negative values', () => {
    expect(add(-2, 3)).toBe(1);
  });
});
