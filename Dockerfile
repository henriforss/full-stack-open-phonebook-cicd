# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.5.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=8.6.12
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install backend deps
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install 

# Install frontend deps
COPY --link frontend/package.json frontend/pnpm-lock.yaml ./frontend/
RUN cd frontend && pnpm install

# Copy backend/all code
COPY --link . .

# Copy frontend code
# COPY --link ./frontend ./frontend

# Build frontend
# RUN cd frontend && pnpm build

# Remove development dependencies
RUN pnpm prune 


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
