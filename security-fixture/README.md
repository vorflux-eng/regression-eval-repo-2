# Security fixture repository

A deliberately small Flask service with **ten planted issues** and **four decoys**,
used by the security regression rows. It is never deployed; every issue is
reachable from source alone, so both repo-only and network modes have something
to find.

The same tree is published to
`https://github.com/vorflux-eng/regression-eval-repo-2` under `security-fixture/`
so a session can clone it. Keep this directory the source of truth and copy it
there when the fixture changes.

## Planted issues

`expected-findings.json` is the grading contract. Each entry has a stable `id`,
the file and line, a CWE, and the kind of evidence a run must produce.

| id | Where | Class |
| --- | --- | --- |
| F1 | `app/main.py` `/search` | SQL injection through an f-string query |
| F2 | `app/main.py` `/ping` | Command injection through `os.system` |
| F3 | `app/main.py` `/download` | Path traversal, no normalization or prefix check |
| F4 | `app/main.py` `/fetch` | SSRF: any URL, redirects followed |
| F5 | `app/main.py` `/restore` | Insecure deserialization of a request cookie |
| F6 | `app/crypto_utils.py` `hash_password` | Unsalted MD5 for passwords |
| F7 | `app/crypto_utils.py` `encrypt` | AES-ECB with a static key |
| F8 | `app/main.py` `SECRET_KEY` | Hardcoded Flask session key |
| F9 | `Dockerfile` | Runs as root, unpinned `python:3.11` base, no healthcheck |
| F10 | `deploy/main.tf` | Public-read S3 bucket with no versioning |

## Decoys

| id | Where | Why it looks wrong but is not |
| --- | --- | --- |
| D1 | `app/main.py` `/user/<id>` | Parameterized query: looks injectable, is not |
| D2 | `app/main.py` `/hello` | `render_template` with autoescaping, not `|safe` |
| D3 | `app/main.py` `/sync` | `subprocess.run` with an argument list and no shell |
| D4 | `app/main.py` `API_TOKEN` | Placeholder that matches a secret-shaped regex but is structural |

## Modes

- repo-only: F1–F10 are all readable from source; static scanners cover F8–F10.
- network (`docker compose up` or a `port expose`): `/search`, `/ping`,
  `/download`, `/fetch` and `/restore` are all unauthenticated.
