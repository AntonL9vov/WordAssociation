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

export class UsersService {
  private usersStorage: UsersStorage;

  constructor(usersStorage: UsersStorage) {
    this.usersStorage = usersStorage;
  }

  getUserById(id: string): User | undefined {
    return this.usersStorage.getUserById(id);
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
