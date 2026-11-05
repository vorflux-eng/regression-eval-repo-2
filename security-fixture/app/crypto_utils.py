"""Crypto helpers with two planted weaknesses."""

import hashlib

from Crypto.Cipher import AES

# Static key, so every deployment encrypts to the same ciphertext.
_KEY = b"0123456789abcdef"


def hash_password(password: str) -> str:
    # F6: MD5, single round, no salt.
    return hashlib.md5(password.encode("utf-8")).hexdigest()


def encrypt(payload: str) -> str:
    # F7: ECB mode, no IV, no authentication tag.
    cipher = AES.new(_KEY, AES.MODE_ECB)
    plain = payload.encode("utf-8")
    plain += b" " * (-len(plain) % 16)
    return cipher.encrypt(plain).hex()
