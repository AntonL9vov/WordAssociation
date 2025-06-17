import { Socket } from "socket.io";
import { User } from "../types/users";

export const emitConnectUser = (socket: Socket, user: User) => {
  socket.emit("user:connected", user);
};

export const emitGetUser = (socket: Socket, user: User | undefined) => {
  socket.emit("user:got", user);
};

export const emitUpdateUser = (socket: Socket, user: User) => {
  socket.emit("user:updated", user);
};

export const emitDeleteUser = (socket: Socket, id: string) => {
  socket.emit("user:deleted", id);
};