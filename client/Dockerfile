# Multi-stage build for React/Vite client
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies stage - только production зависимости
FROM base AS deps
COPY package*.json ./
RUN npm install --only=production --silent

# Build stage - все зависимости для сборки
FROM base AS build
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.bak

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]