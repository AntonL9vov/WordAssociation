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