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
} as const;
