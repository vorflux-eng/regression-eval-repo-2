# Request counts

`GET /stats` returns HTTP 200 with a JSON object keyed by registered route path:

```json
{ "/healthz": 2, "/stats": 1 }
```

Both routes start at zero. Each matched request increments its route count
before the handler sends a response. The `/stats` count includes the current
request. HEAD requests served by the GET routes also count.

Query strings, trailing slashes, and case variants use the same registered route
key. Unmatched paths and unsupported methods do not count. The endpoint sends
`Cache-Control: no-store` to prevent cached statistics.

Counts reside in memory for each app process. A restart resets the counts.
Multiple processes do not share counts. New routes must attach `countRequest`
as route middleware and add their initial zero count to `requestCounts`.
