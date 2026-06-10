"""Generate a bcrypt hash for ADMIN_PASSWORD_HASH.

Usage:
    python -m scripts.hash_password 'my-secret'
    python -m scripts.hash_password           # interactive prompt
"""
from __future__ import annotations

import getpass
import sys

from services.security import hash_password


def main() -> int:
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        password = getpass.getpass("Password: ")
    if not password:
        print("Password is empty", file=sys.stderr)
        return 1
    print(hash_password(password))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
