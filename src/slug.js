'use strict';

const { normalizeOptions } = require('./slug-options');

/**
 * Escape a string for safe use inside a RegExp.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Convert a string into a URL-friendly slug.
 *
 * The result is lowercased, has leading/trailing whitespace removed,
 * accented characters folded to their ASCII equivalents, and non-alphanumeric
 * characters replaced with a separator. Leading and trailing separators are
 * trimmed from the final result.
 *
 * @param {string} input - The string to slugify.
 * @param {object} [options] - See `normalizeOptions` in `./slug-options`.
 *   `separator` sets the replacement character(s) (default `'-'`), and
 *   `collapse` controls repeated-separator behavior: `true` (default) merges
 *   consecutive non-alphanumeric characters into one separator, `false`
 *   replaces each individually so repeats are preserved.
 * @returns {string} The slugified string.
 * @throws {TypeError} If `input` is not a string.
 */
function slugify(input, options) {
  if (typeof input !== 'string') {
    throw new TypeError('slugify expects a string');
  }

  const { separator, collapse } = normalizeOptions(options);

  const base = input
    .normalize('NFKD') // split accented chars into base char + diacritic
    .replace(/[\u0300-\u036f]/g, '') // strip diacritical marks
    .toLowerCase()
    .trim();

  // Replace non-alphanumeric runs (collapse) or single chars (no collapse).
  const nonAlnum = collapse ? /[^a-z0-9]+/g : /[^a-z0-9]/g;
  const replaced = base.replace(nonAlnum, separator);

  if (separator === '') {
    return replaced;
  }

  // Trim leading/trailing separators.
  const sep = escapeRegExp(separator);
  return replaced.replace(new RegExp(`^(?:${sep})+|(?:${sep})+$`, 'g'), '');
}

module.exports = { slugify };
