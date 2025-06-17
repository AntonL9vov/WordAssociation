import { Socket } from "socket.io";
import { UserService, UserHandler } from "../../types/users";
import { Handler } from "../../types/base";
import { userHandlers } from "./user-handlers";

export const createUsersHandler = (
  userService: UserService,
  handlers: UserHandler[]
): Handler[] => {
  return handlers.map((handler) => ({
    event: handler.event,
    handler: (socket: Socket, ...args: unknown[]) =>
      handler.handler(userService, socket, ...args),
  }));
};

export const getUsersHandlers = (userService: UserService) => {
  return createUsersHandler(userService, userHandlers);
};
