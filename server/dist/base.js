"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGame = void 0;
const base_socket_1 = require("./socket-entities/base-socket");
const GameSocket_1 = require("./socket-entities/game-scoket/GameSocket");
const socketEmitterService_1 = require("./services/socketEmitterService");
const app_1 = require("./app");
const ioc_1 = require("./ioc");
const generate_asyncapi_1 = require("./scripts/generate-asyncapi");
const check_docs_1 = require("./scripts/check-docs");
const init_1 = require("./services/init");
const runner_1 = require("./migrations/runner");
const storage_1 = require("./config/storage");
const http_1 = __importDefault(require("http"));
const initialUsersState = [
    {
        id: "1",
        name: "John Doe",
    },
    {
        id: "2",
        name: "Jane Doe",
    },
];
const initialGamesState = {
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
class BaseGame {
    constructor(port = 3000) {
        this.port = port;
        this.isInitialized = false;
        // Empty constructor - actual initialization happens in init()
        // Both HTTP and Socket.IO will run on the same port
    }
    async init() {
        if (this.isInitialized) {
            return;
        }
        try {
            // Run database migrations if using PostgreSQL
            const storageConfig = (0, storage_1.getStorageConfig)();
            if (storageConfig.type === 'postgres') {
                console.log('Running database migrations...');
                const migrationRunner = new runner_1.MigrationRunner();
                await migrationRunner.runMigrations();
            }
            // Initialize services
            const services = await (0, init_1.createServices)();
            this.usersService = services.usersService;
            this.gameService = services.gamesService;
            // Initialize socket emitter service
            this.socketEmitterService = new socketEmitterService_1.SocketEmitterService();
            // Create REST API server with auto-generated documentation
            this.apiServer = (0, app_1.createApiServerV2)(this.usersService, this.gameService);
            // Create HTTP server
            this.httpServer = http_1.default.createServer(this.apiServer);
            // Initialize socket handling with the same HTTP server
            this.gameSocket = new GameSocket_1.GameSocket(this.gameService);
            this.baseSocket = new base_socket_1.BaseSocket([this.gameSocket], this.httpServer);
            // Connect socket emitter service to the socket.io instance
            this.socketEmitterService.setSocketInstance(this.baseSocket.getIO());
            // Generate AsyncAPI documentation (only in development)
            if (process.env.NODE_ENV !== "production") {
                await this.generateAsyncAPIDocumentationOnce();
            }
            // Initialize services for IoC container
            (0, ioc_1.setServices)({
                usersService: this.usersService,
                gameService: this.gameService,
                socketEmitterService: this.socketEmitterService,
            });
            // Start unified server
            this.startServer();
            this.isInitialized = true;
            console.log('✅ Game server initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize game server:', error);
            throw error;
        }
    }
    // Start the unified HTTP/Socket server
    startServer() {
        this.httpServer.listen(this.port, () => {
            console.log(`🚀 Server is running on port ${this.port}`);
            console.log(`📚 HTTP API documentation: http://localhost:${this.port}/docs`);
            console.log(`🔌 WebSocket endpoint: ws://localhost:${this.port}`);
        });
    }
    async generateAsyncAPIDocumentationOnce() {
        // Generate only if not already generated in this session
        if (BaseGame.documentationGenerated) {
            console.log("ℹ️  AsyncAPI documentation already generated in this session");
            return;
        }
        // Check if documentation generation is needed
        if (!(0, check_docs_1.shouldGenerateDocumentation)()) {
            console.log("ℹ️  Documentation is up to date, skipping generation");
            BaseGame.documentationGenerated = true;
            return;
        }
        try {
            await (0, generate_asyncapi_1.generateAsyncAPIDocumentation)();
            BaseGame.documentationGenerated = true;
        }
        catch (error) {
            console.warn("⚠️ Failed to generate AsyncAPI documentation:", error instanceof Error ? error.message : error);
        }
    }
}
exports.BaseGame = BaseGame;
// Generate AsyncAPI documentation for WebSocket (with protection against repeated calls)
BaseGame.documentationGenerated = false;
