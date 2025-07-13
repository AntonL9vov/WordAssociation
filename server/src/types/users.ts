import { Socket } from "socket.io";
import { Handler } from "./base";

export interface User {
  id: string;
  name: string;
}

export interface UsersStorage {
  getUser(id: string): User | undefined;
  addUser(user: Omit<User, "id">): User;
  updateUser(user: User): User;
  deleteUser(id: string): void;
  getAllUsers(): User[];
}

export interface UsersService {
  getUser(id: string): User | undefined;
  addUser(name: string): User;
  updateUser(user: User): User;
  deleteUser(id: string): void;
}

export interface UserHandler extends Omit<Handler, "handler"> {
  handler: (
    userService: UsersService,
    socket: Socket,
    ...args: any[]
  ) => void;
}
