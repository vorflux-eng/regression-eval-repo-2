'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { greet } = require('../src/greeting');

test('greet returns "Hello, <name>!"', () => {
  assert.strictEqual(greet('World'), 'Hello, World!');
  assert.strictEqual(greet('Ada'), 'Hello, Ada!');
});
