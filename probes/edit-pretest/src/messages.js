'use strict';

// Customer-facing notification copy. Keep keys stable.
const messages = {
  orderPlaced: 'Thanks! We received your order.',
  paymentFailed: 'Your payment did not go through. Please try another card.',
  orderShipped: 'Good news: your order has shipped.',
  orderDelivered: 'Your order was delivered. Enjoy!',
  refundIssued: 'We issued your refund. It can take 5 business days to appear.',
};

function render(key, vars = {}) {
  const template = messages[key];
  if (!template) throw new Error('unknown message: ' + key);
  return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}

module.exports = { messages, render };
