import { User } from "../../types/users";
import { SocketEvents } from "../../types/base";
import { Socket } from "socket.io";
import { UsersService } from "../../services/usersService";

export const userSocketEvents: Record<string, SocketEvents> = {
  connect: {
    handler: {
      "user:connect": {
        event: "user:connect",
        callback: (socket: Socket, userService: UsersService, name: string) => {
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
        callback: (socket: Socket, user: User) => {
          socket.emit(userSocketEvents.connect.emit["user:connected"].event, {
            user,
          });
        },
      },
      "user:connect:deprecated": {
        event: "user:connect:deprecated",
        callback: (socket: Socket, message: any) => {
          socket.emit(userSocketEvents.connect.emit["user:connect:deprecated"].event, message);
        },
      },
    },
  },
  disconnect: {
    handler: {
      "user:disconnect": {
        event: "user:disconnect",
        callback: (socket: Socket, userService: UsersService, id: string) => {
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
        callback: (socket: Socket, id: string) => {
          socket.emit(userSocketEvents.disconnect.emit["user:disconnected"].event, { id });
        },
      },
      "user:disconnect:deprecated": {
        event: "user:disconnect:deprecated",
        callback: (socket: Socket, message: any) => {
          socket.emit(userSocketEvents.disconnect.emit["user:disconnect:deprecated"].event, message);
        },
      },
    },
  },
  get: {
    handler: {
      "user:get": {
        event: "user:get",
        callback: (socket: Socket, userService: UsersService, id: string) => {
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
        callback: (socket: Socket, user: User) => {
          socket.emit(userSocketEvents.get.emit["user:got"].event, { user });
        },
      },
      "user:get:deprecated": {
        event: "user:get:deprecated",
        callback: (socket: Socket, message: any) => {
          socket.emit(userSocketEvents.get.emit["user:get:deprecated"].event, message);
        },
      },
    },
  },
  update: {
    handler: {
      "user:update": {
        event: "user:update",
        callback: (socket: Socket, userService: UsersService, user: User) => {
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
        callback: (socket: Socket, user: User) => {
          socket.emit(userSocketEvents.update.emit["user:updated"].event, { user });
        },
      },
      "user:update:deprecated": {
        event: "user:update:deprecated",
        callback: (socket: Socket, message: any) => {
          socket.emit(userSocketEvents.update.emit["user:update:deprecated"].event, message);
        },
      },
    },
  },
} as const;
