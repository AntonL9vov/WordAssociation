#!/bin/sh
set -e

echo "Starting application startup sequence..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is ready!"

# Run database migrations
echo "Running database migrations..."
npm run migrate:build

# Start the application
echo "Starting the application..."
exec "$@"