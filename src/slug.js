'use strict';

/**
 * Convert a string into a URL-friendly slug.
 *
 * The result is lowercased, has leading/trailing whitespace removed,
 * accented characters folded to their ASCII equivalents, and any run of
 * non-alphanumeric characters collapsed into a single hyphen. Leading and
 * trailing hyphens are trimmed from the final result.
 *
 * @param {string} input - The string to slugify.
 * @returns {string} The slugified string.
 * @throws {TypeError} If `input` is not a string.
 */
function slugify(input) {
  if (typeof input !== 'string') {
    throw new TypeError('slugify expects a string');
  }

  return input
    .normalize('NFKD') // split accented chars into base char + diacritic
    .replace(/[\u0300-\u036f]/g, '') // strip diacritical marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // collapse non-alphanumerics into hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

module.exports = { slugify };
