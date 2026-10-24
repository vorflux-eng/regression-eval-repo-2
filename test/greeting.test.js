'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { greet } = require('../src/greeting');

test('greet returns "Hello, <name>!"', () => {
  assert.equal(greet('World'), 'Hello, World!');
  assert.equal(greet('Piyush'), 'Hello, Piyush!');
});
