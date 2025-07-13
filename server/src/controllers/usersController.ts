import { Request, Response } from 'express';
import { UsersService } from '../services/usersService';
import { User } from '../types/users';

export class UsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  // GET /api/users - получить всех пользователей
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = this.usersService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/users/:id - получить пользователя по ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = this.usersService.getUser(id);
      
      if (!user) {
        res.status(404).json({ 
          error: 'User not found',
          message: `User with ID ${id} not found`
        });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/users - создать нового пользователя
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ 
          error: 'Bad request',
          message: 'Name is required and must be a non-empty string'
        });
        return;
      }

      const user = this.usersService.addUser(name.trim());
      res.status(201).json({ user });
    } catch (error) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT /api/users/:id - обновить пользователя
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ 
          error: 'Bad request',
          message: 'Name is required and must be a non-empty string'
        });
        return;
      }

      const existingUser = this.usersService.getUser(id);
      if (!existingUser) {
        res.status(404).json({ 
          error: 'User not found',
          message: `User with ID ${id} not found`
        });
        return;
      }

      const updatedUser = this.usersService.updateUser({ id, name: name.trim() });
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/users/:id - удалить пользователя
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const existingUser = this.usersService.getUser(id);
      if (!existingUser) {
        res.status(404).json({ 
          error: 'User not found',
          message: `User with ID ${id} not found`
        });
        return;
      }

      this.usersService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 