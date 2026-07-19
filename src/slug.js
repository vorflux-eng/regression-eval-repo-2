'use strict';

/**
 * Convert a string into a URL-friendly "slug".
 *
 * A slug is a lowercase, hyphen-separated representation of the input that is
 * safe to use in URLs and file names. This implementation is dependency-free.
 *
 * Steps performed:
 *   1. Validate and coerce the input to a string.
 *   2. Normalise accented/diacritic characters to their ASCII equivalents
 *      (e.g. "Café" -> "cafe") using Unicode normalisation.
 *   3. Lowercase the string (unless `lower: false` is passed).
 *   4. Extract the alphanumeric "words" and join them with the separator.
 *
 * Extracting words and joining (rather than replacing and trimming) means the
 * result never has leading/trailing separators and the separator can be any
 * string — including an empty one — without corrupting the content.
 *
 * @param {string|number} input - The value to slugify.
 * @param {object} [options] - Optional settings.
 * @param {string} [options.separator='-'] - String used to join words.
 * @param {boolean} [options.lower=true] - Lowercase the result.
 * @returns {string} The generated slug (empty string if nothing usable remains).
 * @throws {TypeError} If `input` is not a string/number, or options are invalid.
 */
function slugify(input, options = {}) {
  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError(
      'slugify: input must be a string or number, received ' +
        (input === null ? 'null' : typeof input)
    );
  }

  if (options === null || typeof options !== 'object') {
    throw new TypeError('slugify: options must be an object');
  }

  const separator = options.separator === undefined ? '-' : options.separator;
  const lower = options.lower === undefined ? true : options.lower;

  if (typeof separator !== 'string') {
    throw new TypeError('slugify: options.separator must be a string');
  }

  let str = String(input);

  // Normalise accented characters to base letters, then strip all combining
  // marks (\p{M} covers every Unicode diacritic range, not just the basics).
  str = str.normalize('NFKD').replace(/\p{M}/gu, '');

  if (lower) {
    str = str.toLowerCase();
  }

  // Extract runs of alphanumeric characters and join them with the separator.
  const words = str.match(/[a-zA-Z0-9]+/g);

  return words ? words.join(separator) : '';
}

module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
