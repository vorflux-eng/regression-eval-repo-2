FROM node:24-alpine

WORKDIR /app

COPY package.json ./
COPY src/greeting.js ./src/greeting.js

USER node

CMD ["node", "-e", "console.log(require('./src/greeting').greet(process.argv[1] || 'World'))", "--"]
