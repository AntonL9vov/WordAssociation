# Multi-stage build for Node.js server
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache postgresql-client

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production --silent --ignore-scripts

# Build stage
FROM base AS build
COPY package*.json ./
RUN npm ci --silent --ignore-scripts
COPY . .
RUN npm run build

# Production stage
FROM base AS production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/dist ./dist
COPY --from=build --chown=nextjs:nodejs /app/migrations ./migrations
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]