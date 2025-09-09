"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSocket = void 0;
const socket_io_1 = require("socket.io");
class BaseSocket {
    constructor(sockets, httpServer) {
        this.sockets = [];
        this.httpServer = httpServer;
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.sockets = sockets;
        this.initSocket();
    }
    // Get the io instance for emitting to all clients or rooms
    getIO() {
        return this.io;
    }
    initSocket() {
        this.io.on("connection", (socket) => {
            console.log("Socket connection received:", socket.id);
            // Store reference to current socket for compatibility
            this.socket = socket;
            this.socket.join(`game:${socket.handshake.query.gameId}`);
            // Initialize socket handlers for each socket handler
            this.initSockets(socket);
        });
    }
    initSockets(socket) {
        this.sockets.forEach((socketHandler) => {
            socketHandler.initSocket(socket);
        });
    }
}
exports.BaseSocket = BaseSocket;
