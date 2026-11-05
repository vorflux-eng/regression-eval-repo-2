#!/bin/sh
# Two copies of the same service: :8000 is in scope, :8001 is the excluded peer.
python3 seed.py
python3 -m app.main &
FIXTURE_PORT=8001 FIXTURE_DB=fixture-8001.db python3 -m app.main &
wait
