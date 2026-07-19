'use strict';

// Statistics helpers. All source lives under lib/ (never src/).

function mean(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('mean requires a non-empty array');
  }
  const total = values.reduce((sum, n) => sum + n, 0);
  return total / values.length;
}

module.exports = { mean };
