import type { User, UsersStorage } from "../types/users";

export class UsersService {
  private usersStorage: UsersStorage;

  constructor(usersStorage: UsersStorage) {
    this.usersStorage = usersStorage;
  }

  async getUser(id: string): Promise<User | undefined> {
    return await this.usersStorage.getUser(id);
  }

  async addUser(name: string): Promise<User> {
    return await this.usersStorage.addUser({ name });
  }

  async updateUser(user: User): Promise<User> {
    return await this.usersStorage.updateUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersStorage.deleteUser(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.usersStorage.getAllUsers();
  }
}
