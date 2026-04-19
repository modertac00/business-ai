# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy workspace manifests first (layer cache)
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY scripts/ ./scripts/

RUN npm ci

# Copy backend source
COPY backend/ ./backend/

# Generate Prisma client and compile TypeScript
RUN cd backend && npx prisma generate && npm run build

# ---- Production stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY scripts/ ./scripts/
RUN npm ci --omit=dev

# Copy compiled output and Prisma artifacts
COPY --from=builder /app/backend/dist        ./backend/dist
COPY --from=builder /app/backend/prisma      ./backend/prisma

# Regenerate Prisma client for the production node_modules
RUN cd backend && npx prisma generate

COPY backend/entrypoint.sh ./backend/entrypoint.sh
RUN chmod +x ./backend/entrypoint.sh

WORKDIR /app/backend
EXPOSE 3001

ENTRYPOINT ["sh", "entrypoint.sh"]
