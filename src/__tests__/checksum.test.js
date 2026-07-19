'use strict';

const crypto = require('crypto');
const {
  SUPPORTED_ALGORITHMS,
  checksum,
  crc32,
  crc32Hex,
  verifyChecksum,
} = require('../checksum');

// Reference digests for the empty input and "abc", verifiable against any
// standard implementation.
const KNOWN = {
  md5: {
    '': 'd41d8cd98f00b204e9800998ecf8427e',
    abc: '900150983cd24fb0d6963f7d28e17f72',
  },
  sha1: {
    '': 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    abc: 'a9993e364706816aba3e25717850c26c9cd0d89d',
  },
  sha256: {
    '': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    abc: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  },
  sha512: {
    '':
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce' +
      '47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    abc:
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a' +
      '2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
  },
};

describe('checksum()', () => {
  test('defaults to sha256', () => {
    expect(checksum('abc')).toBe(KNOWN.sha256.abc);
  });

  for (const algo of SUPPORTED_ALGORITHMS) {
    test(`computes correct ${algo} digest for known vectors`, () => {
      expect(checksum('', algo)).toBe(KNOWN[algo]['']);
      expect(checksum('abc', algo)).toBe(KNOWN[algo].abc);
    });
  }

  test('accepts a Buffer and matches the equivalent string', () => {
    expect(checksum(Buffer.from('abc', 'utf8'), 'sha256')).toBe(
      checksum('abc', 'sha256')
    );
  });

  test('is case-insensitive on the algorithm name', () => {
    expect(checksum('abc', 'SHA256')).toBe(KNOWN.sha256.abc);
  });

  test('respects the encoding argument', () => {
    const hex = '616263'; // "abc" in hex
    expect(checksum(hex, 'sha256', 'hex')).toBe(checksum('abc', 'sha256'));
  });

  test('throws on unsupported algorithm', () => {
    expect(() => checksum('abc', 'sha3-256')).toThrow(/Unsupported algorithm/);
  });

  test('throws on non-string algorithm', () => {
    expect(() => checksum('abc', 123)).toThrow(TypeError);
  });

  test('throws on invalid data type', () => {
    expect(() => checksum(42)).toThrow(TypeError);
    expect(() => checksum(null)).toThrow(TypeError);
  });
});

describe('crc32()', () => {
  test('returns 0 for empty input', () => {
    expect(crc32('')).toBe(0);
  });

  test('computes known CRC32 values', () => {
    // Widely published reference values.
    expect(crc32('123456789')).toBe(0xcbf43926);
    expect(crc32('The quick brown fox jumps over the lazy dog')).toBe(0x414fa339);
  });

  test('returns an unsigned 32-bit integer', () => {
    const value = crc32('The quick brown fox jumps over the lazy dog');
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(value)).toBe(true);
  });

  test('accepts a Buffer and matches the equivalent string', () => {
    expect(crc32(Buffer.from('123456789', 'utf8'))).toBe(crc32('123456789'));
  });
});

describe('crc32Hex()', () => {
  test('returns 8-character zero-padded lowercase hex', () => {
    expect(crc32Hex('123456789')).toBe('cbf43926');
    expect(crc32Hex('')).toBe('00000000');
  });

  test('zero-pads short values', () => {
    const hex = crc32Hex('The quick brown fox jumps over the lazy dog');
    expect(hex).toHaveLength(8);
    expect(hex).toBe('414fa339');
  });
});

describe('verifyChecksum()', () => {
  test('returns true for a matching digest', () => {
    expect(verifyChecksum('abc', KNOWN.sha256.abc)).toBe(true);
  });

  test('is case-insensitive on the expected digest', () => {
    expect(verifyChecksum('abc', KNOWN.sha256.abc.toUpperCase())).toBe(true);
  });

  test('returns false for a mismatched digest', () => {
    expect(verifyChecksum('abc', KNOWN.sha256[''])).toBe(false);
  });

  test('returns false when lengths differ (no throw)', () => {
    expect(verifyChecksum('abc', 'deadbeef')).toBe(false);
  });

  test('returns false for malformed non-ASCII expected (no throw)', () => {
    expect(verifyChecksum('abc', 'é'.repeat(64))).toBe(false);
  });

  test('returns false for non-hex expected of matching length', () => {
    expect(verifyChecksum('abc', 'z'.repeat(64))).toBe(false);
  });

  test('supports other algorithms', () => {
    expect(verifyChecksum('abc', KNOWN.md5.abc, 'md5')).toBe(true);
    expect(verifyChecksum('abc', KNOWN.sha512.abc, 'sha512')).toBe(true);
  });

  test('throws on non-string expected', () => {
    expect(() => verifyChecksum('abc', 123)).toThrow(TypeError);
  });
});

describe('SUPPORTED_ALGORITHMS', () => {
  test('matches Node crypto availability', () => {
    const available = crypto.getHashes();
    for (const algo of SUPPORTED_ALGORITHMS) {
      expect(available).toContain(algo);
    }
  });
});
