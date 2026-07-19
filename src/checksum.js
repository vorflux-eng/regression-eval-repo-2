'use strict';

const crypto = require('crypto');

const SUPPORTED_ALGORITHMS = ['md5', 'sha1', 'sha256', 'sha512'];

// Precompute the CRC32 lookup table once at module load (IEEE 802.3,
// polynomial 0xEDB88320).
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

/**
 * Normalize input into a Buffer so all checksum helpers accept both strings
 * and Buffers uniformly.
 *
 * @param {string|Buffer} data - The data to normalize.
 * @param {BufferEncoding} [encoding='utf8'] - Encoding used when data is a string.
 * @returns {Buffer}
 */
function toBuffer(data, encoding = 'utf8') {
  if (Buffer.isBuffer(data)) {
    return data;
  }
  if (typeof data === 'string') {
    return Buffer.from(data, encoding);
  }
  throw new TypeError('data must be a string or Buffer');
}

/**
 * Compute a cryptographic checksum (hash digest) of the given data.
 *
 * @param {string|Buffer} data - The data to hash.
 * @param {string} [algorithm='sha256'] - One of md5, sha1, sha256, sha512.
 * @param {BufferEncoding} [encoding='utf8'] - Encoding used when data is a string.
 * @returns {string} Lowercase hex digest.
 */
function checksum(data, algorithm = 'sha256', encoding = 'utf8') {
  if (typeof algorithm !== 'string') {
    throw new TypeError('algorithm must be a string');
  }
  const normalized = algorithm.toLowerCase();
  if (!SUPPORTED_ALGORITHMS.includes(normalized)) {
    throw new Error(
      `Unsupported algorithm "${algorithm}". Supported: ${SUPPORTED_ALGORITHMS.join(', ')}`
    );
  }
  return crypto.createHash(normalized).update(toBuffer(data, encoding)).digest('hex');
}

/**
 * Compute the CRC32 checksum of the given data.
 *
 * Implements the standard IEEE 802.3 CRC-32 (polynomial 0xEDB88320) using a
 * precomputed lookup table.
 *
 * @param {string|Buffer} data - The data to checksum.
 * @param {BufferEncoding} [encoding='utf8'] - Encoding used when data is a string.
 * @returns {number} Unsigned 32-bit CRC32 value.
 */
function crc32(data, encoding = 'utf8') {
  const buf = toBuffer(data, encoding);
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Compute the CRC32 checksum as an 8-character zero-padded lowercase hex string.
 *
 * @param {string|Buffer} data - The data to checksum.
 * @param {BufferEncoding} [encoding='utf8'] - Encoding used when data is a string.
 * @returns {string}
 */
function crc32Hex(data, encoding = 'utf8') {
  return crc32(data, encoding).toString(16).padStart(8, '0');
}

/**
 * Verify that data matches an expected checksum digest.
 *
 * The comparison is case-insensitive on the hex digest and uses a
 * constant-time comparison to avoid timing side channels. Malformed input
 * (wrong length or non-hex characters) returns false rather than throwing.
 *
 * @param {string|Buffer} data - The data to check.
 * @param {string} expected - The expected hex digest.
 * @param {string} [algorithm='sha256'] - One of md5, sha1, sha256, sha512.
 * @param {BufferEncoding} [encoding='utf8'] - Encoding used when data is a string.
 * @returns {boolean} True if the computed checksum matches expected.
 */
function verifyChecksum(data, expected, algorithm = 'sha256', encoding = 'utf8') {
  if (typeof expected !== 'string') {
    throw new TypeError('expected must be a string');
  }
  const actual = checksum(data, algorithm, encoding);
  const expectedNormalized = expected.toLowerCase();
  // `actual` is always lowercase ASCII hex. Reject anything that isn't a hex
  // string of the exact same length so timingSafeEqual never throws on
  // malformed (e.g. non-ASCII) input, which would otherwise crash callers.
  if (
    expectedNormalized.length !== actual.length ||
    !/^[0-9a-f]*$/.test(expectedNormalized)
  ) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(actual, 'utf8'),
    Buffer.from(expectedNormalized, 'utf8')
  );
}

module.exports = {
  SUPPORTED_ALGORITHMS,
  checksum,
  crc32,
  crc32Hex,
  verifyChecksum,
};
