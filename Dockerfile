FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY src/greeting.js ./src/greeting.js

CMD ["node", "-e", "const { greet } = require('.'); console.log(greet(process.env.NAME || 'World'));"]
