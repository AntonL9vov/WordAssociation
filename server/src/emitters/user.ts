import { Socket } from "socket.io";
import { User } from "../types/users";

export const emitConnectUser = (socket: Socket, user: User) => {
  socket.emit("user:connect", user);
};

export const emitGetUser = (socket: Socket, user: User | undefined) => {
  socket.emit("user:get", user);
};
