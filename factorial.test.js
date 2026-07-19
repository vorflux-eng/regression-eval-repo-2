const factorial = require('./factorial');

describe('factorial', () => {
  test('returns 1 for zero', () => {
    expect(factorial(0)).toBe(1);
  });

  describe('positive inputs', () => {
    test('returns 1 for 1', () => {
      expect(factorial(1)).toBe(1);
    });

    test('returns 120 for 5', () => {
      expect(factorial(5)).toBe(120);
    });

    test('returns 3628800 for 10', () => {
      expect(factorial(10)).toBe(3628800);
    });
  });

  describe('invalid negative input', () => {
    test('throws RangeError for -1', () => {
      expect(() => factorial(-1)).toThrow(RangeError);
    });

    test('throws RangeError for a larger negative number', () => {
      expect(() => factorial(-5)).toThrow(RangeError);
    });
  });
});
