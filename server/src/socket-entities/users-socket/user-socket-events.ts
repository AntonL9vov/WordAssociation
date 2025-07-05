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
          console.log("connect event received");
          const user = userService.addUser(name);

          userSocketEvents.connect.emit["user:connected"].callback(
            socket,
            user
          );
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
    },
  },
  disconnect: {
    handler: {
      "user:disconnect": {
        event: "user:disconnect",
        callback: (socket: Socket, userService: UsersService, id: string) => {
          userService.deleteUser(id);
          userSocketEvents.disconnect.emit["user:disconnected"].callback(
            socket,
            id
          );
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
    },
  },
  get: {
    handler: {
      "user:get": {
        event: "user:get",
        callback: (socket: Socket, userService: UsersService, id: string) => {
          const user = userService.getUser(id);
          userSocketEvents.get.emit["user:got"].callback(socket, user);
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
    },
  },
  update: {
    handler: {
      "user:update": {
        event: "user:update",
        callback: (socket: Socket, userService: UsersService, user: User) => {
          userService.updateUser(user);
          userSocketEvents.update.emit["user:updated"].callback(socket, user);
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
    },
  },
} as const;
