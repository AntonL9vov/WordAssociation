import { Socket } from "socket.io";
import { Handler } from "./base";

export interface User {
  id: string;
  name: string;
}

export interface UsersStorage {
  getUserById(id: string): User | undefined;
  addUser(user: Omit<User, "id">): User;
  updateUser(user: User): User;
  deleteUser(id: string): void;
}

export interface UserService {
  getUserById(id: string): User | undefined;
  addUser(name: string): User;
  updateUser(user: User): User;
  deleteUser(id: string): void;
}

export interface UserHandler extends Omit<Handler, "handler"> {
  handler: (
    userService: UserService,
    socket: Socket,
    ...args: any[]
  ) => void;
}
