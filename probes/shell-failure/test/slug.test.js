'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { slugify } = require('../src/slug');

test('slugify', () => {
  assert.strictEqual(slugify('Héllo, World!'), 'hello-world');
  assert.strictEqual(slugify('  many   spaces  '), 'many-spaces');
});
