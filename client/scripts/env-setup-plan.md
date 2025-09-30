# Environment Setup Script Plan

## Script Functionality

The script will:
1. Copy `.env.example` to `.env` if `.env` doesn't exist
2. Replace placeholder values in `.env` with actual values from environment variables
3. Be executed during the Docker build process

## Script Implementation

```bash
#!/bin/bash

# Environment setup script for Docker builds
set -e

echo "Setting up environment variables..."

# Copy .env.example to .env if it doesn't exist
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo "Copying .env.example to .env"
    cp .env.example .env
fi

# Replace placeholders with actual values if environment variables are set
if [ -f ".env" ]; then
    echo "Updating environment variables in .env file..."
    
    # Replace VITE_API_BASE_URL if provided
    if [ -n "$VITE_API_BASE_URL" ]; then
        sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=${VITE_API_BASE_URL}|g" .env
        echo "Set VITE_API_BASE_URL to ${VITE_API_BASE_URL}"
    fi
    
    # Replace VITE_API_WS_URL if provided
    if [ -n "$VITE_API_WS_URL" ]; then
        sed -i "s|VITE_API_WS_URL=.*|VITE_API_WS_URL=${VITE_API_WS_URL}|g" .env
        echo "Set VITE_API_WS_URL to ${VITE_API_WS_URL}"
    fi
fi

echo "Environment setup complete."
```

## Dockerfile Modifications

The Dockerfile needs to be updated to:
1. Accept build arguments for environment variables
2. Run the environment setup script during the build process

## Docker Compose Modifications

The docker-compose.yml file needs to be updated to:
1. Pass environment variables as build arguments
2. Maintain the existing environment variable configuration

## Implementation Steps

1. Create the environment setup script in `client/scripts/env-setup.sh`
2. Modify `client/Dockerfile` to use the script
3. Update `docker-compose.yml` to pass build arguments
4. Test the solution