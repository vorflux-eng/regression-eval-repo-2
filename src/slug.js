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
 *   4. Replace any run of non-alphanumeric characters with the separator.
 *   5. Trim leading/trailing separators.
 *
 * @param {string} input - The value to slugify.
 * @param {object} [options] - Optional settings.
 * @param {string} [options.separator='-'] - Character used to join words.
 * @param {boolean} [options.lower=true] - Lowercase the result.
 * @param {boolean} [options.strict=false] - When true, characters that are not
 *   alphanumeric or the separator are removed entirely rather than being
 *   collapsed into a separator (after the initial replacement).
 * @returns {string} The generated slug (empty string if nothing usable remains).
 * @throws {TypeError} If `input` is null, undefined, or not a string/number.
 */
function slugify(input, options = {}) {
  if (input === null || input === undefined) {
    throw new TypeError('slugify: input must be a string or number, received ' + input);
  }

  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError(
      'slugify: input must be a string or number, received ' + typeof input
    );
  }

  if (options === null || typeof options !== 'object') {
    throw new TypeError('slugify: options must be an object');
  }

  const separator = options.separator === undefined ? '-' : options.separator;
  const lower = options.lower === undefined ? true : options.lower;
  const strict = options.strict === undefined ? false : options.strict;

  if (typeof separator !== 'string') {
    throw new TypeError('slugify: options.separator must be a string');
  }

  let str = String(input);

  // Normalise accented characters to base letters, then strip combining marks.
  str = str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

  if (lower) {
    str = str.toLowerCase();
  }

  // Collapse every run of characters that are not letters or digits into a
  // single separator. This handles spaces, punctuation, symbols, etc.
  str = str.replace(/[^a-zA-Z0-9]+/g, separator);

  // In strict mode, remove any residual characters that are neither
  // alphanumeric nor the separator (guards against multi-char separators).
  if (strict && separator) {
    const escaped = escapeRegExp(separator);
    str = str.replace(new RegExp('[^a-zA-Z0-9' + escaped + ']', 'g'), '');
  }

  // Trim leading/trailing separators without regex (separator may be empty
  // or contain regex-special characters).
  str = trimSeparator(str, separator);

  return str;
}

/**
 * Escape a string so it can be safely embedded inside a RegExp character class
 * or pattern.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
}

/**
 * Remove leading and trailing occurrences of `separator` from `str`.
 * Safe when `separator` is empty (returns the string unchanged).
 *
 * @param {string} str
 * @param {string} separator
 * @returns {string}
 */
function trimSeparator(str, separator) {
  if (!separator) {
    return str;
  }

  let start = 0;
  let end = str.length;

  while (str.startsWith(separator, start)) {
    start += separator.length;
  }

  while (end - separator.length >= start && str.startsWith(separator, end - separator.length)) {
    end -= separator.length;
  }

  return str.slice(start, end);
}

module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
