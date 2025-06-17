import { v4 as uuidv4 } from "uuid";
import { User, UsersStorage as IUsersStorage } from "../types/users";

export class UsersStorage implements IUsersStorage {
  private users: User[] = [];

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  addUser(user: Omit<User, "id">): User {
    const newUser = { id: uuidv4(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(user: User): User {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return user;
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
