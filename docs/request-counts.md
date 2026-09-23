# Request counts

`GET /stats` returns an object with a request count for each route:

```json
{ "/healthz": 2, "/stats": 1 }
```

Both routes start at zero. Each matched request increments its route count
before the handler sends a response. The `/stats` count includes the current
request. Express also serves HEAD requests through these GET routes, so HEAD
requests count toward the same route totals.

Query strings, case differences, and trailing slashes do not create separate
counts. Unknown routes and unsupported methods do not change the counts.

Counts stay in memory for one app process and reset when the process restarts.
Multiple processes do not share counts. When adding a route, initialize its
count in `requestCounts` and attach `countRequest` before its handler.

Run `npm test -- --runInBand` to check the health endpoint and request counts.
