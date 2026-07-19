'use strict';

const slugify = require('../src/slug');

describe('slugify', () => {
  describe('basic conversion', () => {
    test('lowercases and hyphenates a simple phrase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    test('collapses multiple spaces into a single separator', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    test('replaces punctuation and symbols with the separator', () => {
      expect(slugify('Hello, World! & Friends?')).toBe('hello-world-friends');
    });

    test('trims leading and trailing separators', () => {
      expect(slugify('  ---Hello World---  ')).toBe('hello-world');
    });

    test('keeps digits intact', () => {
      expect(slugify('Top 10 Songs of 2024')).toBe('top-10-songs-of-2024');
    });

    test('handles an already-slug-shaped string', () => {
      expect(slugify('already-a-slug')).toBe('already-a-slug');
    });
  });

  describe('unicode and accents', () => {
    test('normalises accented characters to ASCII', () => {
      expect(slugify('Café au lait')).toBe('cafe-au-lait');
    });

    test('handles a mix of diacritics', () => {
      expect(slugify('Crème Brûlée')).toBe('creme-brulee');
    });

    test('drops characters with no ASCII equivalent', () => {
      expect(slugify('日本語 text')).toBe('text');
    });
  });

  describe('edge cases', () => {
    test('returns empty string for empty input', () => {
      expect(slugify('')).toBe('');
    });

    test('returns empty string when only symbols are present', () => {
      expect(slugify('!!!@@@###')).toBe('');
    });

    test('accepts a number and coerces it to a string', () => {
      expect(slugify(2024)).toBe('2024');
    });

    test('coerces a negative number, dropping the sign', () => {
      expect(slugify(-42)).toBe('42');
    });
  });

  describe('options', () => {
    test('supports a custom separator', () => {
      expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
    });

    test('trims a custom multi-character separator', () => {
      expect(slugify('  Hello World  ', { separator: '__' })).toBe('hello__world');
    });

    test('preserves case when lower is false', () => {
      expect(slugify('Hello World', { lower: false })).toBe('Hello-World');
    });

    test('empty separator concatenates words', () => {
      expect(slugify('Hello World', { separator: '' })).toBe('helloworld');
    });

    test('strict mode removes residual non-alphanumeric characters', () => {
      // With separator '.', strict mode strips a stray character class edge.
      expect(slugify('a.b.c', { separator: '.', strict: true })).toBe('a.b.c');
    });
  });

  describe('input validation', () => {
    test('throws a TypeError for null', () => {
      expect(() => slugify(null)).toThrow(TypeError);
    });

    test('throws a TypeError for undefined', () => {
      expect(() => slugify(undefined)).toThrow(TypeError);
    });

    test('throws a TypeError for an object input', () => {
      expect(() => slugify({})).toThrow(TypeError);
    });

    test('throws a TypeError for an array input', () => {
      expect(() => slugify(['a'])).toThrow(TypeError);
    });

    test('throws a TypeError when options is not an object', () => {
      expect(() => slugify('hi', 'nope')).toThrow(TypeError);
    });

    test('throws a TypeError when separator is not a string', () => {
      expect(() => slugify('hi', { separator: 5 })).toThrow(TypeError);
    });
  });

  describe('module exports', () => {
    test('exposes named and default exports pointing at the same function', () => {
      expect(slugify.slugify).toBe(slugify);
      expect(slugify.default).toBe(slugify);
    });
  });
});
