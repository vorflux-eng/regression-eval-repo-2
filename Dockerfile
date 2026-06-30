# Minimal image for a dependency-free Node.js app.
FROM node:20-alpine

WORKDIR /app

# Copy the manifest first to leverage layer caching. There are no
# dependencies, so no `npm install` step is needed.
COPY package.json ./

# Copy application source.
COPY src ./src

# Run as the unprivileged user that ships with the base image.
USER node

ENTRYPOINT ["node", "src/index.js"]
