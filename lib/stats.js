'use strict';

function mean(values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

module.exports = { mean };
