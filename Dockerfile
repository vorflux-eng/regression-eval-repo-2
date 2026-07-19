# Minimal image for the dependency-free greeting module.
FROM node:22-alpine

WORKDIR /app

# Copy the manifest and source. There are no dependencies to install.
COPY package.json ./
COPY src ./src
COPY bin ./bin

# Use ENTRYPOINT so runtime args pass through to the greeter:
#   docker run <image>            -> "Hello, World!"
#   docker run <image> Ada        -> "Hello, Ada!"
ENTRYPOINT ["node", "bin/cli.js"]
