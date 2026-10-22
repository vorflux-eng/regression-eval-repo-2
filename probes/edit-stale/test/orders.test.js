'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { paginate, formatOrder, summarize } = require('../src/orders');

test('paginate returns the requested page', () => {
  const items = Array.from({ length: 45 }, (_, i) => i);
  assert.deepStrictEqual(paginate(items, 2, 10), [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
});

test('formatOrder renders two decimals', () => {
  assert.strictEqual(formatOrder({ id: 'A1', total: 3.5, currency: 'EUR' }), 'A1: 3.50 EUR');
});

test('summarize groups by currency', () => {
  const orders = [
    { total: 1, currency: 'USD' },
    { total: 2.25, currency: 'EUR' },
    { total: 4, currency: 'USD' },
  ];
  assert.deepStrictEqual(summarize(orders), ['EUR 2.25', 'USD 5.00']);
});
