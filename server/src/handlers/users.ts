import { Socket } from "socket.io";
import { UserService, UserHandler } from "../types/users";
import { Handler } from "../types/base";

const createUsersHandler = (
  userService: UserService,
  handlers: UserHandler[]
): Handler[] => {
  return handlers.map((handler) => ({
    event: handler.event,
    handler: (socket: Socket, ...args: unknown[]) =>
      handler.handler(userService, socket, ...args),
  }));
};

export const usersHandlers: UserHandler[] = [
  {
    event: "user:connect",
    handler: (userService: UserService, socket: Socket) => {
      console.log("user:connect event received");
      console.log("A user connected:", socket.id);
    },
  },
];
