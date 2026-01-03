# syntax=docker/dockerfile:labs

# Arrange arguments
ARG target=development
ARG workspaceDir=/workspace

# ================
# stage
# ================
FROM docker.io/node:current-bullseye-slim AS stage
ARG workspaceDir

# Set working directory
WORKDIR ${workspaceDir}

# Push GitHub access token to .npmrc file
COPY .npmrc ./
RUN --mount=type=secret,id=github-access-token,env=GITHUB_ACCESS_TOKEN echo $GITHUB_ACCESS_TOKEN >> ./.npmrc

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --include dev

# Add scripts onto container and allow them to be executed
COPY --parents scripts/* ./
RUN chmod -R a+x scripts/container/build.mts
RUN chmod -R a+x scripts/container/stage.mts
RUN chmod -R a+x scripts/container/test.mts

# Copy other files needed for subsequent targets
COPY babel.config.cts eslint.config.ts jest.config.json tsconfig.build.json tsconfig.json ./
COPY --parents src/* ./

# ================
# build
# ================
FROM stage AS build

# Build!
RUN node --loader ts-node/esm ./scripts/container/build.mts

ENTRYPOINT [ "/bin/sh", "-c" ]

# ================
# test
# ================
FROM build AS test

# Test!
RUN node --loader ts-node/esm ./scripts/container/test.mts

ENTRYPOINT [ "/bin/sh", "-c" ]
