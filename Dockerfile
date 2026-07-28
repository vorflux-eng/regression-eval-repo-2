FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY src ./src

CMD ["node", "-e", "console.log(require('.').greet(process.env.NAME || 'World'))"]
