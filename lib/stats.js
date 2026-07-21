'use strict';

function mean(values) {
  if (values.length === 0) {
    return NaN;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

module.exports = { mean };
