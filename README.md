# Multiplayer Game

A multiplayer game built with React, TypeScript, Vite, Socket.IO, Express, and Storybook.

## Project Structure

```
multiplayer-game/
├── client/        # React frontend
└── server/        # Node.js backend
```

## Setup Instructions

1. First, install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

2. Start the development servers:

```bash
# Start the client (in one terminal)
cd client
npm run dev

# Start the server (in another terminal)
cd ../server
npm run dev
```

3. Access the application:
- Client: http://localhost:5173
- Storybook: http://localhost:6006
- Server: http://localhost:3000

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Vite
  - Storybook
  - Socket.IO Client
  - TailwindCSS

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - TypeScript
  - CORS
  - Jest

## Development

The project is set up with hot-reloading for both client and server. Any changes you make will be automatically reflected in the browser.
