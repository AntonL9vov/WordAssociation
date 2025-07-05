import type { User, UsersStorage } from "../types/users";

export class UsersService {
  private usersStorage: UsersStorage;

  constructor(usersStorage: UsersStorage) {
    this.usersStorage = usersStorage;
  }

  getUser(id: string): User | undefined {
    return this.usersStorage.getUser(id);
  }

  addUser(name: string): User {
    return this.usersStorage.addUser({ name });
  }

  updateUser(user: User): User {
    return this.usersStorage.updateUser(user);
  }

  deleteUser(id: string): void {
    this.usersStorage.deleteUser(id);
  }
}
