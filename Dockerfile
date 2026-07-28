FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY src ./src

CMD ["node", "-e", "const { greet } = require('./src/greeting'); console.log(greet(process.env.NAME || 'World')); "]
