'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { slugify } = require('./slug');

test('lowercases and hyphenates a simple string', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});

test('collapses runs of non-alphanumeric characters into one hyphen', () => {
  assert.equal(slugify('foo   bar__baz!!qux'), 'foo-bar-baz-qux');
});

test('trims leading and trailing separators', () => {
  assert.equal(slugify('  --Hello--  '), 'hello');
});

test('folds accented characters to ASCII', () => {
  assert.equal(slugify('Crème Brûlée'), 'creme-brulee');
});

test('handles numbers', () => {
  assert.equal(slugify('Top 10 Songs'), 'top-10-songs');
});

test('returns an empty string when there are no alphanumerics', () => {
  assert.equal(slugify('!!!'), '');
  assert.equal(slugify(''), '');
});

test('preserves repeated separators when collapse is false', () => {
  assert.equal(slugify('foo   bar', { collapse: false }), 'foo---bar');
});

test('supports a custom separator', () => {
  assert.equal(slugify('Hello World', { separator: '_' }), 'hello_world');
});

test('throws a TypeError for non-string input', () => {
  assert.throws(() => slugify(42), TypeError);
  assert.throws(() => slugify(null), TypeError);
  assert.throws(() => slugify(undefined), TypeError);
});
