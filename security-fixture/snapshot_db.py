"""Print a hash and row counts for the fixture database, before or after a run.

A security run in passive mode must leave the hash unchanged. An intrusive run
must print a different hash, and the diff of the two snapshots is what proves
exactly which tables it touched.

Usage:
    python3 snapshot_db.py            # print the current snapshot
    python3 snapshot_db.py --diff f   # compare against a saved snapshot file

Run it from the fixture root with `--host-path fixture.db`. The container name and
the in-image path are overridable for the containerised Juice Shop, so the same
script covers both fixtures.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path


CONTAINER = "security_eval-juice-shop-1"
CONTAINER_DB = "/app/fixture.db"
TABLES = ("items", "users")


def read_database(container: str, container_path: str, host_path: str) -> bytes:
    if host_path:
        return Path(host_path).read_bytes()
    copy = subprocess.run(
        ["docker", "cp", f"{container}:{container_path}", "-"],
        check=True,
        capture_output=True,
    )
    return copy.stdout


def snapshot(raw: bytes) -> dict[str, object]:
    """Hash the bytes and count rows per table.

    Row counts come from a scratch copy so a failure to read one table never
    hides the hash, which is the assertion the passive row relies on.
    """
    result: dict[str, object] = {"sha256": hashlib.sha256(raw).hexdigest(), "rows": {}}
    scratch = Path("/var/tmp/security-eval-snapshot.sqlite")
    scratch.write_bytes(raw)
    for table in TABLES:
        query = f'SELECT count(*) FROM "{table}"'
        counts = subprocess.run(
            ["sqlite3", str(scratch), query], check=False, capture_output=True, text=True
        )
        result["rows"][table] = counts.stdout.strip() if counts.returncode == 0 else "error"
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--container", default=CONTAINER)
    parser.add_argument("--container-path", default=CONTAINER_DB)
    parser.add_argument("--host-path", default="", help="read a host file instead of the container")
    parser.add_argument("--diff", default="", help="compare against a saved snapshot JSON file")
    args = parser.parse_args()

    current = snapshot(read_database(args.container, args.container_path, args.host_path))
    if not args.diff:
        print(json.dumps(current, indent=2))
        return 0

    previous = json.loads(Path(args.diff).read_text())
    changed = current["sha256"] != previous.get("sha256")
    print(json.dumps({"changed": changed, "before": previous, "after": current}, indent=2))
    return 1 if changed else 0


if __name__ == "__main__":
    sys.exit(main())
