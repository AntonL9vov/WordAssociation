import { Socket } from "socket.io";
import { UserService, UserHandler, User } from "../../types/users";
import {
  emitConnectUser,
  emitDeleteUser,
  emitGetUser,
  emitUpdateUser,
} from "../../emitters/user";

const userConnectHandler: UserHandler = {
  event: "user:connect",
  handler: (userService: UserService, socket: Socket, name: string) => {
    const user = userService.addUser(name);
    emitConnectUser(socket, user);
  },
};

const getUserHandler: UserHandler = {
  event: "user:get",
  handler: (userService: UserService, socket: Socket, id: string) => {
    const user = userService.getUserById(id);
    emitGetUser(socket, user);
  },
};

const updateUserHandler: UserHandler = {
  event: "user:update",
  handler: (userService: UserService, socket: Socket, user: User) => {
    const updatedUser = userService.updateUser(user);
    emitUpdateUser(socket, updatedUser);
  },
};

const deleteUserHandler: UserHandler = {
  event: "user:delete",
  handler: (userService: UserService, socket: Socket, id: string) => {
    userService.deleteUser(id);
    emitDeleteUser(socket, id);
  },
};

export const userHandlers: UserHandler[] = [
  userConnectHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
];
