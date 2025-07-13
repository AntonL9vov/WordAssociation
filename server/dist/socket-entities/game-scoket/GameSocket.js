"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSocket = void 0;
const game_socket_events_1 = require("./game-socket-events");
class GameSocket {
    constructor(gameService) {
        this.gameService = gameService;
        this.gameSocketEvents = game_socket_events_1.gameSocketEvents;
    }
    initSocket(socket) {
        this.socket = socket;
        this.initEvents();
    }
    initEvents() {
        Object.values(this.gameSocketEvents).forEach((value) => {
            if (!value.handler)
                return;
            Object.values(value.handler).forEach((handler) => {
                this.socket?.on(handler.event, (...data) => {
                    handler.callback(this.socket, this.gameService, ...data);
                });
            });
        });
    }
}
exports.GameSocket = GameSocket;
