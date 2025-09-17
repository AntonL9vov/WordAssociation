# VDS Server Deployment Guide

## Quick Fix for Current Issues

### 1. Create Environment File
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your server details
nano .env
```

**Important environment variables to update:**
```bash
# Change these values for your VDS server:
POSTGRES_PASSWORD=your_strong_password_123
VITE_API_BASE_URL_PROD=http://YOUR_SERVER_IP:3000
VITE_API_WS_URL_PROD=ws://YOUR_SERVER_IP:3000

# Replace YOUR_SERVER_IP with your actual server IP
# Example: VITE_API_BASE_URL_PROD=http://192.168.1.100:3000
```

### 2. Fixed Docker Issues
✅ **Fixed npm install postinstall script error**
- Added `--ignore-scripts` flag to skip git hooks setup in Docker
- Git hooks are only needed for development, not production

### 3. Build and Run
```bash
# Clean previous builds
docker-compose down --volumes --remove-orphans

# Build with no cache
docker-compose build --no-cache

# Start services
docker-compose up -d
```

## Alternative: Step-by-Step Build
If the full build still fails, try building services individually:

```bash
# Build database first
docker-compose up postgres -d

# Wait for database to be ready
docker-compose logs -f postgres
# Wait until you see "database system is ready to accept connections"

# Build and start server
docker-compose up server --build -d

# Build and start client
docker-compose up client --build -d
```

## Troubleshooting

### Check Service Status
```bash
docker-compose ps
docker-compose logs server
docker-compose logs client
```

### If npm install still fails:
The issue might be with the Node.js version or network connectivity. Try:

```bash
# Use alternative base image
# Edit server/Dockerfile and client/Dockerfile
# Change: FROM node:18-bullseye-slim AS base
# To:     FROM node:18-alpine AS base
```

### Memory Issues
If your VDS has limited memory:
```bash
# Build one service at a time
docker-compose build postgres
docker-compose build server  
docker-compose build client

# Then start all
docker-compose up -d
```

### Network Issues
If npm packages fail to download:
```bash
# Add to Dockerfile before npm install:
RUN npm config set registry https://registry.npmjs.org/
```

## Final Check
After successful deployment:
- App: http://YOUR_SERVER_IP
- API Health: http://YOUR_SERVER_IP:3000/health  
- API Docs: http://YOUR_SERVER_IP:3000/api/docs

## Security Notes for Production
1. Change all default passwords in `.env`
2. Use HTTPS in production (setup reverse proxy)
3. Configure firewall rules
4. Regular security updates