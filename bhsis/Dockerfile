# Build stage
FROM node:20-alpine AS builder
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/delivery?currentSchema=bhsis
ENV DATABASE_URL=${DATABASE_URL}
ENV PGOPTIONS="-c search_path=bhsis"

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
# Ensure pnpm patched dependencies are available during install
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client (needs schema in place)
RUN pnpm prisma generate
RUN PRISMA_RELATIVE=$(find node_modules/.pnpm -path '*/node_modules/.prisma' -print -quit) && \
    ln -s "/app/$PRISMA_RELATIVE" node_modules/.prisma

# Build application
RUN pnpm build

# Runtime stage
FROM node:20-alpine
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/delivery?currentSchema=bhsis
ENV DATABASE_URL=${DATABASE_URL}
ENV PGOPTIONS="-c search_path=bhsis"

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
# Ensure pnpm patched dependencies are available during install
COPY patches ./patches

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/index.js"]
