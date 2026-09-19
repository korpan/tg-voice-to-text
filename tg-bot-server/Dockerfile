# Build stage
FROM node:24-slim AS builder

# Install build dependencies for native modules (like better-sqlite3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# Install production dependencies and compile native modules
RUN npm install --production

# ---

# Production stage
FROM node:24-slim

# Install runtime dependencies only (ffmpeg is needed for audio processing)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Install global tools needed for the current startup script
RUN npm install -g typescript ts-node

CMD ["npm", "start"]
