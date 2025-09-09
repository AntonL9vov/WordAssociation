#!/bin/bash

# Test runner script for multiplayer-game client

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the client directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the client directory."
    exit 1
fi

# Parse command line arguments
COVERAGE=false
UI=false
WATCH=false
SPECIFIC_TEST=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --coverage|-c)
            COVERAGE=true
            shift
            ;;
        --ui|-u)
            UI=true
            shift
            ;;
        --watch|-w)
            WATCH=true
            shift
            ;;
        --test|-t)
            SPECIFIC_TEST="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -c, --coverage    Run tests with coverage report"
            echo "  -u, --ui         Run tests with UI interface"
            echo "  -w, --watch      Run tests in watch mode"
            echo "  -t, --test FILE  Run specific test file"
            echo "  -h, --help       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                          # Run all tests"
            echo "  $0 --coverage              # Run with coverage"
            echo "  $0 --ui                    # Run with UI"
            echo "  $0 --test GameHeader       # Run specific test"
            echo "  $0 --watch --test GameFlow # Watch specific test"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Build test command
CMD="npm run test"

if [ "$COVERAGE" = true ]; then
    CMD="npm run test:coverage"
    print_status "Running tests with coverage..."
elif [ "$UI" = true ]; then
    CMD="npm run test:ui"
    print_status "Running tests with UI interface..."
else
    print_status "Running tests..."
fi

# Add specific test if provided
if [ -n "$SPECIFIC_TEST" ]; then
    CMD="$CMD -- $SPECIFIC_TEST"
    print_status "Running specific test: $SPECIFIC_TEST"
fi

# Add watch mode if specified
if [ "$WATCH" = true ]; then
    CMD="$CMD -- --watch"
    print_status "Running in watch mode..."
fi

print_status "Executing: $CMD"
echo ""

# Run the command
if eval $CMD; then
    print_success "Tests completed successfully!"
    
    if [ "$COVERAGE" = true ]; then
        echo ""
        print_status "Coverage report generated:"
        print_status "- HTML: test-results/unit/html/vitest.html"
        print_status "- JSON: test-results/unit/json/vitest.json"
    fi
else
    exit_code=$?
    print_error "Tests failed with exit code $exit_code"
    exit $exit_code
fi
