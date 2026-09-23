# Health check server

Use Node.js 22 or later.

```sh
npm ci
npm start
```

The server listens on port 3000 by default. Set `PORT` to use another port.

```sh
curl -i http://localhost:3000/healthz
```

`GET /healthz` returns HTTP 200 with the JSON body `{"status":"ok"}`.

Run the endpoint test with `npm test`.
