import { ApiService } from "./api";
import { User } from "@/shared/lib/types";

export class UserService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  // Получить всех пользователей
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.apiService.get<{ users: User[] }>("/users");
      return response.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Получить пользователя по ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await this.apiService.get<{ user: User }>(
        `/users/${id}`
      );
      return response.user;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  // Создать нового пользователя
  async createUser(name: string): Promise<User> {
    try {
      const response = await this.apiService.post<{ user: User }>("/users", {
        name,
      });
      return response.user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Обновить пользователя
  async updateUser(id: string, name: string): Promise<User> {
    try {
      const response = await this.apiService.post<{ user: User }>(
        `/users/${id}`,
        { name }
      );
      return response.user;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  // Удалить пользователя
  async deleteUser(id: string): Promise<void> {
    try {
      await this.apiService.post<void>(`/users/${id}`, {});
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

export const userService = new UserService();
