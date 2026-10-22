#!/usr/bin/env bash
# Pre-merge verification: unit tests plus a check that no file under src/
# contains a TODO marker.
set -euo pipefail
cd "$(dirname "$0")/.."
node --test
if grep -rn "TODO" src; then
  echo "verify: TODO markers found" >&2
  exit 1
fi
echo "verify: ok"
