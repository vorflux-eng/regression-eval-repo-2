'use strict';

/**
 * Build a greeting message for the given name.
 *
 * @param {string} [name] - The name to greet. Defaults to "World".
 * @returns {string} A greeting such as "Hello, World!".
 */
function greet(name = 'World') {
  const trimmed = typeof name === 'string' ? name.trim() : '';
  return `Hello, ${trimmed || 'World'}!`;
}

module.exports = { greet };
