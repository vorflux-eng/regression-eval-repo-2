'use strict';

/**
 * Build a greeting for the given name.
 * @param {string} name - The name to greet.
 * @returns {string} A greeting of the form "Hello, <name>!".
 */
function greet(name) {
  return `Hello, ${name}!`;
}

module.exports = { greet };
