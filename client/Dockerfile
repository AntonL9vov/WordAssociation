# Multi-stage build for React/Vite client
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies stage - только production зависимости
FROM base AS deps
COPY package*.json ./
RUN npm install --only=production --silent

# Build stage - все зависимости для сборки
FROM base AS build
# Accept build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_API_WS_URL

# Set environment variables
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_WS_URL=$VITE_API_WS_URL

COPY package*.json ./
RUN npm install --silent
COPY . .

# Create .env file with environment variables
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
RUN echo "VITE_API_WS_URL=${VITE_API_WS_URL}" >> .env

# Build the application

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

CMD ["nginx", "-g", "daemon off;"]