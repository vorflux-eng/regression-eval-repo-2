const { mean } = require('../lib/stats');

test('mean returns the average of positive numbers', () => {
  expect(mean([2, 4, 6])).toBe(4);
});

test('mean supports negative numbers', () => {
  expect(mean([-2, -4, -6])).toBe(-4);
});

test('mean supports decimal results', () => {
  expect(mean([1, 2])).toBe(1.5);
});
