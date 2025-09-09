"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocketEvents = void 0;
exports.userSocketEvents = {
    connect: {
        handler: {
            "user:connect": {
                event: "user:connect",
                callback: (socket, userService, name) => {
                    console.log("user:connect event received - SOCKET IO SKELETON (use REST API instead)");
                    // Скелет для будущего использования
                    // В реальном приложении используйте REST API: POST /api/users
                    socket.emit("user:connect:deprecated", {
                        message: "This endpoint is deprecated. Use REST API: POST /api/users instead"
                    });
                },
            },
        },
        emit: {
            "user:connected": {
                event: "user:connected",
                callback: (socket, user) => {
                    socket.emit(exports.userSocketEvents.connect.emit["user:connected"].event, {
                        user,
                    });
                },
            },
            "user:connect:deprecated": {
                event: "user:connect:deprecated",
                callback: (socket, message) => {
                    socket.emit(exports.userSocketEvents.connect.emit["user:connect:deprecated"].event, message);
                },
            },
        },
    },
    disconnect: {
        handler: {
            "user:disconnect": {
                event: "user:disconnect",
                callback: (socket, userService, id) => {
                    console.log("user:disconnect event received - SOCKET IO SKELETON (use REST API instead)");
                    // Скелет для будущего использования
                    // В реальном приложении используйте REST API: DELETE /api/users/:id
                    socket.emit("user:disconnect:deprecated", {
                        message: "This endpoint is deprecated. Use REST API: DELETE /api/users/:id instead"
                    });
                },
            },
        },
        emit: {
            "user:disconnected": {
                event: "user:disconnected",
                callback: (socket, id) => {
                    socket.emit(exports.userSocketEvents.disconnect.emit["user:disconnected"].event, { id });
                },
            },
            "user:disconnect:deprecated": {
                event: "user:disconnect:deprecated",
                callback: (socket, message) => {
                    socket.emit(exports.userSocketEvents.disconnect.emit["user:disconnect:deprecated"].event, message);
                },
            },
        },
    },
    get: {
        handler: {
            "user:get": {
                event: "user:get",
                callback: (socket, userService, id) => {
                    console.log("user:get event received - SOCKET IO SKELETON (use REST API instead)");
                    // Скелет для будущего использования
                    // В реальном приложении используйте REST API: GET /api/users/:id
                    socket.emit("user:get:deprecated", {
                        message: "This endpoint is deprecated. Use REST API: GET /api/users/:id instead"
                    });
                },
            },
        },
        emit: {
            "user:got": {
                event: "user:got",
                callback: (socket, user) => {
                    socket.emit(exports.userSocketEvents.get.emit["user:got"].event, { user });
                },
            },
            "user:get:deprecated": {
                event: "user:get:deprecated",
                callback: (socket, message) => {
                    socket.emit(exports.userSocketEvents.get.emit["user:get:deprecated"].event, message);
                },
            },
        },
    },
    update: {
        handler: {
            "user:update": {
                event: "user:update",
                callback: (socket, userService, user) => {
                    console.log("user:update event received - SOCKET IO SKELETON (use REST API instead)");
                    // Скелет для будущего использования
                    // В реальном приложении используйте REST API: PUT /api/users/:id
                    socket.emit("user:update:deprecated", {
                        message: "This endpoint is deprecated. Use REST API: PUT /api/users/:id instead"
                    });
                },
            },
        },
        emit: {
            "user:updated": {
                event: "user:updated",
                callback: (socket, user) => {
                    socket.emit(exports.userSocketEvents.update.emit["user:updated"].event, { user });
                },
            },
            "user:update:deprecated": {
                event: "user:update:deprecated",
                callback: (socket, message) => {
                    socket.emit(exports.userSocketEvents.update.emit["user:update:deprecated"].event, message);
                },
            },
        },
    },
};
