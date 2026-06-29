# syntax=docker/dockerfile:1

# Containerize the small Node.js greeting service.
# Zero runtime dependencies, no lockfile, and no HTTP server: this is a
# one-shot container that prints the greeting and exits.
FROM node:22-alpine

LABEL org.opencontainers.image.title="regression-eval-repo-2" \
      org.opencontainers.image.description="Small self-contained Node.js greeting utility"

WORKDIR /app

# No `npm install`: there are zero dependencies and no package-lock.json.
# Copy only what is needed, owned by the built-in non-root `node` user.
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src

# Run as the non-root `node` user that ships with the official node image.
USER node

CMD ["node", "src/index.js"]
