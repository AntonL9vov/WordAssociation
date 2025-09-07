import { Pool } from 'pg';
import { User, UsersStorage as IUsersStorage } from "../../types/users";
import { DatabaseConnection } from '../../config/database';

export class PostgresUsersStorage implements IUsersStorage {
  private pool: Pool;

  constructor() {
    this.pool = DatabaseConnection.getInstance().getPool();
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const query = 'SELECT id, name FROM users WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return undefined;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  async addUser(user: Omit<User, "id">): Promise<User> {
    try {
      const query = `
        INSERT INTO users (name) 
        VALUES ($1) 
        RETURNING id, name
      `;
      const result = await this.pool.query(query, [user.name]);
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
      };
    } catch (error) {
      console.error('Error adding user:', error);
      throw new Error(`Failed to add user: ${error}`);
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const query = `
        UPDATE users 
        SET name = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 
        RETURNING id, name
      `;
      const result = await this.pool.query(query, [user.id, user.name]);
      
      if (result.rows.length === 0) {
        throw new Error(`User with id ${user.id} not found`);
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      
      if (result.rowCount === 0) {
        throw new Error(`User with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error(`Failed to delete user: ${error}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const query = 'SELECT id, name FROM users ORDER BY created_at';
      const result = await this.pool.query(query);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error(`Failed to get all users: ${error}`);
    }
  }
}