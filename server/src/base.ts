import { UsersService } from "./services/usersService";
import { BaseSocket } from "./socket-entities/base-socket";
import { GameSocket } from "./socket-entities/game-scoket/GameSocket";
import { GameService } from "./services/gameService";
import { SocketEmitterService } from "./services/socketEmitterService";
import { User } from "./types/users";
import { Game } from "./types/game";
import { createApiServerV2 } from "./app";
import { setServices } from "./ioc";
import { generateAsyncAPIDocumentation } from "./scripts/generate-asyncapi";
import { shouldGenerateDocumentation } from "./scripts/check-docs";
import { createServices } from "./services/init";
import { MigrationRunner } from "./migrations/runner";
import { getStorageConfig } from "./config/storage";
import express from "express";
import http from "http";

const initialUsersState: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
];

const initialGamesState: Record<string, Game> = {
  "1": {
    id: "1",
    rounds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    startWord: "",
    status: "created",
    players: [
      {
        id: "1",
        name: "John Doe",
      },
      {
        id: "2",
        name: "Jane Doe",
      },
    ],
    playersEmittedWords: {},
  },
};

export class BaseGame {
  private usersService!: UsersService;
  private gameService!: GameService;
  private socketEmitterService!: SocketEmitterService;
  private gameSocket!: GameSocket;
  private baseSocket!: BaseSocket;
  private apiServer!: express.Application;
  private httpServer!: http.Server;
  private isInitialized = false;

  constructor(private port: number = 3000) {
    // Empty constructor - actual initialization happens in init()
    // Both HTTP and Socket.IO will run on the same port
  }

  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Run database migrations if using PostgreSQL
      const storageConfig = getStorageConfig();
      if (storageConfig.type === 'postgres') {
        console.log('Running database migrations...');
        const migrationRunner = new MigrationRunner();
        await migrationRunner.runMigrations();
      }

      // Initialize services
      const services = await createServices();
      this.usersService = services.usersService;
      this.gameService = services.gamesService;

      // Initialize socket emitter service
      this.socketEmitterService = new SocketEmitterService();

      // Create REST API server with auto-generated documentation
      this.apiServer = createApiServerV2(this.usersService, this.gameService);
      
      // Create HTTP server
      this.httpServer = http.createServer(this.apiServer);

      // Initialize socket handling with the same HTTP server
      this.gameSocket = new GameSocket(this.gameService);
      this.baseSocket = new BaseSocket([this.gameSocket], this.httpServer);
      
      // Connect socket emitter service to the socket.io instance
      this.socketEmitterService.setSocketInstance(this.baseSocket.getIO());

      // Generate AsyncAPI documentation (only in development)
      if (process.env.NODE_ENV !== "production") {
        await this.generateAsyncAPIDocumentationOnce();
      }

      // Initialize services for IoC container
      setServices({
        usersService: this.usersService,
        gameService: this.gameService,
        socketEmitterService: this.socketEmitterService,
      });

      // Start unified server
      this.startServer();

      this.isInitialized = true;
      console.log('✅ Game server initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize game server:', error);
      throw error;
    }
  }

  // Start the unified HTTP/Socket server
  public startServer(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`🚀 Server is running on port ${this.port}`);
      console.log(`📚 HTTP API documentation: http://localhost:${this.port}/docs`);
      console.log(`🔌 WebSocket endpoint: ws://localhost:${this.port}`);
    });
  }

  // Generate AsyncAPI documentation for WebSocket (with protection against repeated calls)
  private static documentationGenerated = false;

  private async generateAsyncAPIDocumentationOnce(): Promise<void> {
    // Generate only if not already generated in this session
    if (BaseGame.documentationGenerated) {
      console.log(
        "ℹ️  AsyncAPI documentation already generated in this session"
      );
      return;
    }

    // Check if documentation generation is needed
    if (!shouldGenerateDocumentation()) {
      console.log("ℹ️  Documentation is up to date, skipping generation");
      BaseGame.documentationGenerated = true;
      return;
    }

    try {
      await generateAsyncAPIDocumentation();
      BaseGame.documentationGenerated = true;
    } catch (error) {
      console.warn(
        "⚠️ Failed to generate AsyncAPI documentation:",
        error instanceof Error ? error.message : error
      );
    }
  }
}
