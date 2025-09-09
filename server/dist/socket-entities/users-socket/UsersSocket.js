"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersSocket = void 0;
const user_socket_events_1 = require("./user-socket-events");
class UsersSocket {
    constructor(userService) {
        this.usersService = userService;
        this.userSocketEvents = user_socket_events_1.userSocketEvents;
    }
    initSocket(socket) {
        this.socket = socket;
        this.initEvents();
    }
    initEvents() {
        Object.values(this.userSocketEvents).forEach((value) => {
            if (!value.handler)
                return;
            Object.values(value.handler).forEach((handler) => {
                this.socket?.on(handler.event, (...data) => {
                    handler.callback(this.socket, this.usersService, ...data);
                });
            });
        });
    }
}
exports.UsersSocket = UsersSocket;
