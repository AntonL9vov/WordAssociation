import { Socket } from "socket.io";
import { Handler } from "./base";

export interface User {
  id: string;
  name: string;
}

export interface UsersStorage {
  getUser(id: string): Promise<User | undefined>;
  addUser(user: Omit<User, "id">): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
}

export interface UsersService {
  getUser(id: string): Promise<User | undefined>;
  addUser(name: string): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export interface UserHandler extends Omit<Handler, "handler"> {
  handler: (
    userService: UsersService,
    socket: Socket,
    ...args: any[]
  ) => void;
}
