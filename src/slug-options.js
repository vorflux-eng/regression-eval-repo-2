'use strict';

/**
 * Normalize and validate options for slug generation.
 *
 * This is a small compatibility layer so slug behavior can be configured
 * without changing `slugify`'s call sites. It fills in defaults and validates
 * types, returning a plain options object that other modules can rely on.
 *
 * Supported options:
 * - `separator` {string} - character(s) inserted in place of non-alphanumeric
 *   runs. Default `'-'`.
 * - `collapse`  {boolean} - when `true` (default), consecutive non-alphanumeric
 *   characters collapse into a single separator; when `false`, each such
 *   character is replaced individually (so repeated separators are preserved).
 *
 * @param {object} [options] - Partial options object.
 * @returns {{ separator: string, collapse: boolean }} Normalized options.
 * @throws {TypeError} If `options` is not an object, or a field has a bad type.
 */
function normalizeOptions(options = {}) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('normalizeOptions expects an options object');
  }

  const separator = options.separator === undefined ? '-' : options.separator;
  if (typeof separator !== 'string') {
    throw new TypeError('options.separator must be a string');
  }

  const collapse = options.collapse === undefined ? true : Boolean(options.collapse);

  return { separator, collapse };
}

module.exports = { normalizeOptions };
