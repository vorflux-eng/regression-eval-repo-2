'use strict';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function paginate(items, page, pageSize) {
  const size = Math.min(pageSize || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const start = (page - 1) * size;
  return items.slice(start, start + size);
}

function formatOrder(order) {
  return order.id + ': ' + order.total.toFixed(2) + ' ' + order.currency;
}

function summarize(orders) {
  const totals = {};
  for (const order of orders) {
    totals[order.currency] = (totals[order.currency] || 0) + order.total;
  }
  return Object.keys(totals)
    .sort()
    .map((currency) => currency + ' ' + totals[currency].toFixed(2));
}

module.exports = { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, paginate, formatOrder, summarize };
