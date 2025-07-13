"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSocket = void 0;
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
class BaseSocket {
    constructor(sockets) {
        this.port = Number(process.env.PORT) || 3000;
        this.sockets = [];
        this.app = (0, express_1.default)();
        this.httpServer = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.sockets = sockets;
        this.initServer();
        this.initSocket();
    }
    initServer() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.httpServer.listen(this.port, () => {
            console.log(`🚀 Server is running on port ${this.port}`);
            console.log(`📚 Documentation available at:`);
            console.log(`   • WebSocket UI: http://localhost:${this.port}/docs`);
            console.log(`   • Swagger UI: http://localhost:${this.port}/docs/swagger`);
            console.log(`   • JSON API: http://localhost:${this.port}/api/docs`);
            console.log(`   • OpenAPI: http://localhost:${this.port}/api/docs/openapi`);
            console.log(`🔌 WebSocket server: ws://localhost:${this.port}`);
        });
    }
    initSocket() {
        this.io.on("connection", (socket) => {
            console.log("connection event received");
            this.socket = socket;
            this.initSockets();
        });
    }
    initSockets() {
        if (!this.socket)
            return;
        this.sockets.forEach((socket) => {
            socket.initSocket(this.socket);
        });
    }
    /**
     * Настраивает документацию в Express приложении
     */
    setupDocumentation(docMiddleware) {
        docMiddleware.setupRoutes(this.app);
    }
}
exports.BaseSocket = BaseSocket;
