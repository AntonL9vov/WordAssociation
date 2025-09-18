# Production Deployment Guide

## 🎯 Overview

This guide provides complete instructions for deploying the multiplayer game on a VDS server with:
- **Client** accessible at `/` (root path, no ports)
- **API** accessible at `/api/*` (proxied to backend)
- **WebSocket** accessible at `/socket.io/*` (proxied to backend)
- **Single port access** - everything through port 80 (or your chosen port)

## 🏗️ Architecture

### Production Setup
```
Client (Nginx) -> Port 80
├── / -> Static React App
├── /api/* -> Backend Server (Port 3000)
├── /socket.io/* -> Socket.IO Server (Port 3000)
└── /health -> Health Check (Port 3000)
```

### Development Setup
```
Client -> Port 5173 (Vite Dev Server)
Server -> Port 3000 (Express + Socket.IO)
Database -> Port 5433 (PostgreSQL)
```

## 🚀 Quick Deployment

### 1. Clone and Setup Environment
```bash
git clone <your-repo-url>
cd multiplayer-game

# Create environment configuration
cp .env.example .env
```

### 2. Configure Environment Variables
Edit `.env` file:
```bash
# Required: Database password
POSTGRES_PASSWORD=your_strong_password_123

# Required: Application port (default: 80)
APP_PORT=80

# For production, leave these empty for relative URLs (recommended)
VITE_API_BASE_URL_PROD=
VITE_API_WS_URL_PROD=

# Optional: Custom port if not using port 80
# APP_PORT=8080
```

### 3. Deploy
```bash
# Clean any previous deployment
docker-compose down --volumes --remove-orphans

# Build and start (production)
docker-compose up --build -d

# Check status
docker-compose ps
docker-compose logs -f
```

### 4. Access Your Application
- **Main App**: `http://your-server-ip` (or `http://your-server-ip:8080` if using custom port)
- **API Health**: `http://your-server-ip/health`
- **API Docs**: `http://your-server-ip/api/docs`

## 🛠️ Development vs Production

### Development Mode
```bash
# Use development compose with separate ports
docker-compose -f docker-compose.dev.yml up --build -d

# Access:
# - Client: http://localhost:5173
# - Server: http://localhost:3000
# - Database: localhost:5433
```

### Production Mode
```bash
# Use production compose with nginx proxy
docker-compose up --build -d

# Access:
# - Everything: http://localhost (or your chosen port)
```

## 🔧 Configuration Details

### Environment Variables Reference

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `APP_PORT` | N/A | `80` | External port for production app |
| `VITE_API_BASE_URL_PROD` | N/A | `""` (empty) | API base URL (empty = relative) |
| `VITE_API_WS_URL_PROD` | N/A | `""` (empty) | WebSocket URL (empty = relative) |
| `VITE_API_BASE_URL_DEV` | `http://localhost:3000` | N/A | Dev API URL |
| `VITE_API_WS_URL_DEV` | `ws://localhost:3000` | N/A | Dev WebSocket URL |
| `POSTGRES_PASSWORD` | Required | Required | Database password |
| `NODE_ENV` | `development` | `production` | Runtime environment |

### Nginx Reverse Proxy Routes

The nginx configuration automatically handles:

| Request Path | Proxied To | Description |
|--------------|------------|-------------|
| `/` | Static Files | React application |
| `/api/*` | `server:3000/api/*` | REST API endpoints |
| `/socket.io/*` | `server:3000/socket.io/*` | Socket.IO connections |
| `/health` | `server:3000/health` | Health check endpoint |

## 📝 Custom Port Configuration

To use a custom port (e.g., 8080 instead of 80):

```bash
# In .env file
APP_PORT=8080

# Deploy
docker-compose up --build -d

# Access at
# http://your-server-ip:8080
```

## 🧠 Troubleshooting

### Common Issues

#### 1. Build Fails with npm errors
```bash
# Clean Docker cache
docker system prune -a --volumes

# Rebuild without cache
docker-compose build --no-cache
```

#### 2. Can't Access Application
```bash
# Check if services are running
docker-compose ps

# Check logs
docker-compose logs client
docker-compose logs server
docker-compose logs postgres

# Check port binding
docker-compose port client 80
```

#### 3. API/WebSocket Not Working
```bash
# Check nginx proxy configuration
docker-compose exec client cat /etc/nginx/conf.d/default.conf

# Test backend directly (should work)
curl http://localhost:3000/health

# Check internal network connectivity
docker-compose exec client wget -O- http://server:3000/health
```

#### 4. Database Connection Issues
```bash
# Check database status
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U postgres -d multiplayer_game -c "SELECT 1;"
```

### Performance Optimization

#### Memory Issues
```bash
# Monitor resource usage
docker stats

# If low memory, build one service at a time
docker-compose build postgres
docker-compose build server
docker-compose build client

# Then start all
docker-compose up -d
```

#### Slow Build Times
```bash
# Enable BuildKit (if not already enabled)
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Use parallel builds
docker-compose build --parallel
```

## 🔒 Security Recommendations

### For Production Deployment

1. **Change Default Passwords**
   ```bash
   # Generate strong password
   openssl rand -base64 32
   
   # Update in .env
   POSTGRES_PASSWORD=<generated-password>
   ```

2. **Use HTTPS** (recommended)
   - Set up reverse proxy with SSL (nginx, traefik, or cloudflare)
   - Update environment variables to use `https://` and `wss://`

3. **Firewall Configuration**
   ```bash
   # Only allow necessary ports
   ufw allow 80
   ufw allow 443  # if using HTTPS
   ufw enable
   ```

4. **Regular Updates**
   ```bash
   # Update images regularly
   docker-compose pull
   docker-compose up -d
   ```

## 📊 Monitoring

### Health Checks
```bash
# Application health
curl http://your-server/health

# Service status
docker-compose ps

# Resource usage
docker stats $(docker-compose ps -q)
```

### Logs
```bash
# Follow all logs
docker-compose logs -f

# Service-specific logs
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f postgres

# Log files location
docker-compose exec server find /app -name "*.log"
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Backup Database
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres multiplayer_game > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres multiplayer_game < backup.sql
```

### Clean Up
```bash
# Remove unused images and volumes
docker system prune -a --volumes

# Reset completely (WARNING: destroys all data)
docker-compose down --volumes --remove-orphans
docker system prune -a --volumes
```