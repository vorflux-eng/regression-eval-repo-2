# Minimal image for the greeting service.
FROM node:20-alpine

WORKDIR /app

# No external dependencies, so only the manifest and source are copied.
COPY package.json ./
COPY src ./src

# ENTRYPOINT (not CMD) so `docker run <image> <name>` appends the name argument,
# e.g. `docker run greeting-service World` -> "Hello, World!".
ENTRYPOINT ["node", "src/index.js"]
