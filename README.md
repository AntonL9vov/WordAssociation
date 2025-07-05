# Multiplayer Game

A multiplayer game built with React, TypeScript, Vite, Socket.IO, Express, and Storybook.

## 🎮 Game Overview

This is a word association game where players:
- **Create or join games** using unique game IDs
- **Submit words** in synchronized rounds
- **Continue playing** until all players submit the same word (convergence)
- **Chat in real-time** with other players during gameplay
- **Experience smooth gameplay** with real-time updates via WebSocket connections

### Game Mechanics
- Players join a game room with a unique game ID
- Each round, all players simultaneously submit a word
- The game continues to the next round if players submit different words
- The game ends when all players submit the same word (convergence achieved)
- Real-time chat allows players to communicate during gameplay

## Project Structure

```
multiplayer-game/
├── client/        # React frontend
└── server/        # Node.js backend
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd multiplayer-game
```

2. **Install dependencies for both client and server:**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Start the development servers:**
```bash
# Start the client (in one terminal)
cd client
npm run dev

# Start the server (in another terminal)
cd ../server
npm run dev
```

4. **Access the application:**
- **Client:** http://localhost:5173
- **Storybook:** http://localhost:6006
- **Server:** http://localhost:3000

## Available Scripts

### Client Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run storybook    # Start Storybook
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
```

### Server Scripts
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run test         # Run unit tests
```

## Features

### Core Game Features
- **Real-time multiplayer gameplay** with WebSocket connections
- **Game creation and joining** with unique game IDs
- **Synchronized word submission** in rounds
- **Automatic round progression** when all players submit words
- **Game completion detection** when players converge on the same word
- **Player management** with real-time join/leave notifications

### User Interface
- **Modern, responsive design** with Material-UI components
- **Dark/Light theme toggle** with system preference detection
- **Real-time chat system** with message history
- **Game state visualization** showing current round and player status
- **Accessible design** with proper focus management and keyboard navigation

### Developer Experience
- **TypeScript** for type safety across the entire stack
- **Feature-Sliced Design (FSD)** architecture for scalable code organization
- **Comprehensive testing** with Vitest, React Testing Library, and Playwright
- **Storybook** for component development and documentation
- **Hot reloading** for both client and server development
- **ESLint** configuration for code quality

## Architecture

### Frontend Architecture
- **Feature-Sliced Design (FSD)** methodology
- **React Router** for client-side routing
- **Socket.IO Client** for real-time communication
- **Material-UI** for consistent component design
- **CSS Custom Properties** for theming and responsive design

### Backend Architecture
- **Express.js** with Socket.IO for real-time communication
- **TypeScript** for type safety and better developer experience
- **Modular service architecture** with clear separation of concerns
- **In-memory storage** with extensible storage interfaces
- **Event-driven architecture** for game state management

### Real-time Communication
- **WebSocket connections** via Socket.IO
- **Event-driven game state updates**
- **Automatic reconnection** handling
- **Room-based multiplayer** with game isolation

## 🧪 Testing

### Client Testing
- **Unit tests** with Vitest and React Testing Library
- **E2E tests** with Playwright
- **Component testing** with Storybook
- **Test coverage** reporting

### Server Testing
- **Unit tests** with Vitest
- **Service layer testing** for business logic
- **Storage layer testing** for data persistence

## 🎨 Theming

The application supports both light and dark themes:
- **Automatic theme detection** based on system preferences
- **Manual theme toggle** in the header
- **Persistent theme selection** stored in localStorage
- **Smooth theme transitions** with CSS custom properties

## 🔧 Development

The project is set up with hot-reloading for both client and server. Any changes you make will be automatically reflected in the browser.

### Code Organization
- **Feature-based structure** following FSD methodology
- **Clear separation** between UI, business logic, and data layers
- **Reusable components** in the shared layer
- **Type-safe API** communication between client and server

### Adding New Features
1. Create feature folder in `client/src/features/`
2. Add UI components in `ui/` subfolder
3. Add types in `types/` subfolder if needed
4. Export from feature's `index.ts`
5. Add to main features export in `client/src/features/index.ts`

## 📦 Technologies Used

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI** for component library
- **Socket.IO Client** for real-time communication
- **React Router** for client-side routing
- **Storybook** for component development
- **Playwright** for E2E testing
- **Vitest** for unit testing

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time WebSocket communication
- **TypeScript** for type safety
- **CORS** for cross-origin requests
- **UUID** for unique identifier generation
- **Vitest** for testing

### Development Tools
- **ESLint** for code linting
- **TypeScript** for static type checking
- **Nodemon** for server auto-restart
- **PostCSS** for CSS processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy gaming! 🎮**
