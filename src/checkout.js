/**
 * Compute the checkout total for a list of items, with an optional
 * percentage discount applied to the subtotal.
 *
 * @param {Array<{name: string, price: number, quantity: number}>} items
 * @param {number} [discountPercent=0] – percentage discount (0-100)
 * @returns {{subtotal: number, discount: number, total: number}}
 */
function computeTotal(items, discountPercent = 0) {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }

  if (discountPercent < 0 || discountPercent > 100) {
    throw new RangeError("discountPercent must be between 0 and 100");
  }

  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const discountAmount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  const total = Math.round((subtotal - discountAmount) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: discountAmount,
    total,
  };
}

module.exports = { computeTotal };
