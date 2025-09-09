# Docker Setup for Multiplayer Game

Professional Docker containerization for the multiplayer word association game.

## Quick Start

```bash
# Start the entire application stack
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Services

- **PostgreSQL** (port 5432): Database
- **Redis** (port 6379): Caching and sessions
- **Server** (port 3000): Node.js API server
- **Client** (port 80): React frontend served via Nginx

## Architecture

- Multi-stage Docker builds for optimized production images
- Health checks for all services
- Automatic database migrations on startup
- Persistent data storage via Docker volumes
- Production-ready Nginx configuration with proxy

## Environment Variables

### Server Configuration
- `NODE_ENV=production`
- `STORAGE_TYPE=postgres`
- `DB_HOST=postgres`
- `DB_PASSWORD=gamepassword123`

### Client Configuration
- `VITE_API_BASE_URL_PROD=http://localhost:3000`
- `VITE_ENV=production`

## Data Persistence

Database data is persisted in the `postgres_data` Docker volume.

## Development

For development with hot reload, create a `docker-compose.dev.yml` with volume mounts.

## Access Points

- Application: http://localhost
- API Documentation: http://localhost:3000/docs
- Direct API: http://localhost:3000

## Troubleshooting

```bash
# Check container logs
docker-compose logs [service-name]

# Restart a specific service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up -d --build
```