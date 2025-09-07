import { BaseGame } from "./base";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  try {
    const gameEntity = new BaseGame(3000); // Single port for both HTTP and Socket
    await gameEntity.init();
    console.log('🚀 Server started successfully');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();