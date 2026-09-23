FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY src/greeting.js ./src/greeting.js

USER node

CMD ["node", "-e", "console.log(require('./src/greeting').greet(process.env.NAME || 'World'))"]
