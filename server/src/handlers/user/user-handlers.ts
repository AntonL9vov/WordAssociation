import { Socket } from "socket.io";
import { UserService, UserHandler } from "../../types/users";
import { emitConnectUser, emitGetUser } from "../../emitters/user";

const userConnectHandler: UserHandler = {
  event: "user:connect",
  handler: (userService: UserService, socket: Socket, name: string) => {
    console.log("user:connect event received");
    console.log("A user connected:", socket.id);
    const user = userService.addUser(name);
    console.log("User added:", user);
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

export const userHandlers: UserHandler[] = [userConnectHandler, getUserHandler];
