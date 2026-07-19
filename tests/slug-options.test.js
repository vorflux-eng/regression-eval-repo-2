'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeOptions } = require('../src/slug-options');

test('returns defaults when called with no argument', () => {
  assert.deepEqual(normalizeOptions(), { separator: '-', collapse: true });
});

test('returns defaults for an empty object', () => {
  assert.deepEqual(normalizeOptions({}), { separator: '-', collapse: true });
});

test('respects a custom separator', () => {
  assert.deepEqual(normalizeOptions({ separator: '_' }), {
    separator: '_',
    collapse: true,
  });
});

test('coerces collapse to a boolean', () => {
  assert.equal(normalizeOptions({ collapse: 0 }).collapse, false);
  assert.equal(normalizeOptions({ collapse: 1 }).collapse, true);
  assert.equal(normalizeOptions({ collapse: false }).collapse, false);
});

test('allows an empty-string separator', () => {
  assert.deepEqual(normalizeOptions({ separator: '' }), {
    separator: '',
    collapse: true,
  });
});

test('throws a TypeError when options is not an object', () => {
  assert.throws(() => normalizeOptions(null), TypeError);
  assert.throws(() => normalizeOptions('nope'), TypeError);
  assert.throws(() => normalizeOptions([]), TypeError);
});

test('throws a TypeError when separator is not a string', () => {
  assert.throws(() => normalizeOptions({ separator: 5 }), TypeError);
});
