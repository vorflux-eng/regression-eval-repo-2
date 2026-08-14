# Skill Search API

A deterministic Node.js 20+ / Express 5 REST API for searching a small, static skill catalog. It searches skill names, tags, and descriptions and returns inspectable integer relevance scores. The service has no persistence, writes, authentication, pagination, frontend, caching, or external-service dependency.

## Run

Prerequisite: Node.js 20 or newer.

```sh
npm ci
npm start
npm test
```

`npm start` listens on port 3000 when `PORT` is absent. A present `PORT` must be a decimal integer from 1 through 65535; surrounding whitespace and leading zeroes are allowed. For example:

```sh
PORT=3100 npm start
```

Empty values, signed values, decimal values, exponent notation, hexadecimal values, and values outside the range fail before the app is constructed or listens. Direct startup writes exactly this line to standard error and exits nonzero:

```text
Invalid PORT: expected a decimal integer from 1 to 65535.
```

## API

The only endpoint is:

```text
GET /api/v1/skills/search?q=<keyword>&platform=<slug>&sort=relevance
```

Only `q`, `platform`, and `sort` are accepted. Express uses the simple query parser, so repeated parameters are arrays and invalid; bracketed names such as `q[name]` are unsupported keys.

### Examples

The normative Express search returns one result with score 121:

```sh
curl 'http://localhost:3000/api/v1/skills/search?q=express&platform=api'
```

```json
{
  "data": [{
    "id": "skill-express-routing",
    "name": "Express Routing",
    "description": "Define HTTP routes and middleware with Express.",
    "platforms": ["api"],
    "tags": ["express", "routing", "middleware"],
    "relevanceScore": 121
  }],
  "meta": { "query": "express", "platform": "api", "sort": "relevance", "count": 1 }
}
```

Omitting `platform` searches every platform and returns an explicit `null` metadata value:

```sh
curl 'http://localhost:3000/api/v1/skills/search?q=node'
```

A meaningful query that has no matches is successful:

```sh
curl 'http://localhost:3000/api/v1/skills/search?q=unfindable'
# {"data":[],"meta":{"query":"unfindable","platform":null,"sort":"relevance","count":0}}
```

A punctuation-only query is invalid:

```sh
curl 'http://localhost:3000/api/v1/skills/search?q=!'
```

It returns HTTP 400 with this envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": [{
      "field": "q",
      "issue": "q must contain at least one letter or number token and at least 2 letter or number characters"
    }]
  }
}
```

All unmatched paths and methods, including `POST /api/v1/skills/search`, return HTTP 404:

```json
{"error":{"code":"NOT_FOUND","message":"Route not found"}}
```

Unexpected service failures return a sanitized HTTP 500 envelope and never include exception details:

```json
{"error":{"code":"INTERNAL_ERROR","message":"Internal server error"}}
```

## Validation and normalization

`q` is required and must be exactly one string. `platform` and `sort` are optional, but when supplied must each be exactly one string. Raw string limits are checked before normalization:

| Parameter | Raw limit | Normalized limit | Additional rule |
| --- | ---: | ---: | --- |
| `q` | 512 UTF-16 code units | 100 Unicode code points | At least one letter/number token and at least two total letter/number code points |
| `platform` | 256 UTF-16 code units | 50 Unicode code points | Must be a platform derived from the active catalog |
| `sort` | 64 UTF-16 code units | — | Must normalize to `relevance` |

Text normalization is NFKC, lowercase, NFKC again, trim, then collapse whitespace to one ASCII space. `sort` is case-insensitive and defaults to `relevance`. Platforms use the same normalization, so an injected catalog value such as `Api` or `ＡＰＩ` has canonical slug `api` for validation, filtering, and metadata; returned record fields retain their source values.

Tokens are `/[\p{L}\p{N}]+/gu` runs from normalized text. Precomposed and decomposed accents normalize identically. A standalone combining mark creates no token; a non-composable combining mark between letters/numbers separates token runs. This is deliberately deterministic tokenization rather than locale-aware word segmentation.

Each recognized field emits at most one issue. The field order is `q`, `platform`, `sort`, then one `query` detail for all unsupported keys, whose `keys` array uses direct code-point ordering. The exported `VALIDATION_ISSUES` map is the canonical public issue text.

## Ranking

Searches score only platform-eligible records. A query phrase is compared as normalized token sequences, so `node.js`, `node-js`, and `node js` share phrase view `node js`. Repeated query tokens are retained for phrase matching; first-occurrence unique query tokens are used for token scoring.

Phrase weights:

- name exact phrase: +100; otherwise a contiguous name phrase: +50
- an individual exact tag phrase: +25 once
- contiguous description phrase: +10 once

For every unique query token, field groups score independently:

| Field group | Exact token | Eligible prefix |
| --- | ---: | ---: |
| name | +20 | +10 |
| all tags | +12 | +6 |
| description | +4 | +2 |

A prefix is `fieldToken.startsWith(queryToken)`, needs at least two Unicode code points in the query token, and is used only if that field group has no exact token for it. Exact and prefix points do not stack in one field group. Phrase and token signals intentionally do stack: the single-token `express` record receives `50 + 25 + 10 + 20 + 12 + 4 = 121`.

Records scoring zero are omitted. Results sort by descending score, then normalized name ascending and ID ascending using direct JavaScript code-point comparisons (not locale comparison or insertion order). Every returned record contains only public seed fields plus integer `relevanceScore`.

## Catalog and extension seams

The checked-in catalog is in `src/skills/skills.data.js`, is deeply frozen, and resets to its original state on process restart. Seed records have globally unique lowercase-slug IDs, nonblank display fields, nonempty platform/tag arrays, and no duplicate normalized platform or tag within a record. Add a seed by preserving those invariants and freezing the record and nested arrays like the existing entries.

The service is intentionally testable through dependency injection:

- `createApp({ catalog = SKILLS, search = searchSkills })`
- `createSkillsRouter({ catalog, search })`
- `searchSkills({ query, platform, catalog })`
- `startServer({ app, port })`
- `runCli({ createApp, env, stderr })`

These seams permit custom in-memory catalogs and synchronous or promise-returning search functions without adding a database or service integration.
