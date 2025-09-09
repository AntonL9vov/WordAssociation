import { v4 as uuidv4 } from "uuid";
import { User, UsersStorage as IUsersStorage } from "../types/users";

export class UsersStorage implements IUsersStorage {
  private users: User[];

  constructor(initialState: User[] = []) {
    this.users = initialState;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async addUser(user: Omit<User, "id">): Promise<User> {
    const newUser = { id: uuidv4(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
}
