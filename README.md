# healthz-express-server

A simple Node.js Express server with a health check endpoint.

## Requirements

- Node.js 18+

## Install

```bash
npm install
```

## Run

```bash
npm start
```

The server listens on port `3000` by default (override with the `PORT` environment variable).

## Endpoint

### `GET /healthz`

Returns the service health status.

**Response** — `200 OK`

```json
{ "status": "ok" }
```

## Test

```bash
npm test
```
