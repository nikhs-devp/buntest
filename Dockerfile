# Dockerfile
FROM node:18-slim

RUN apt-get update && apt-get install -y graphicsmagick imagemagick ghostscript

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN bun install

# Build the application
RUN bun build

# Copy source code
COPY . .

EXPOSE 8080

# Start the application
CMD ["bun", "start"]
