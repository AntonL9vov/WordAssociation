import { Controller, Get, Post, Put, Delete, Route, Path, Body, Tags, Response, Example, SuccessResponse } from 'tsoa';
import { UsersService } from '../services/usersService';

export interface User {
  /** @example "user-123" */
  id: string;
  /** @example "John Doe" */
  name: string;
}

export interface CreateUserRequest {
  /** @example "John Doe" */
  name: string;
}

export interface ErrorResponse {
  /** @example "User not found" */
  error: string;
  /** @example "User with ID user-123 not found" */
  message: string;
}

@Route('api/users')
@Tags('Users')
export class UsersController extends Controller {
  constructor(private usersService: UsersService) {
    super();
  }

  @Get()
  @Response<ErrorResponse>(500, 'Internal server error')
  public async getAllUsers(): Promise<{ users: User[] }> {
    try {
      const users = this.usersService.getAllUsers();
      return { users };
    } catch (error) {
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  @Get('{id}')
  @Response<ErrorResponse>(404, 'User not found')
  public async getUserById(@Path() id: string): Promise<{ user: User }> {
    try {
      const user = this.usersService.getUser(id);
      if (!user) {
        this.setStatus(404);
        throw new Error(`User with ID ${id} not found`);
      }
      return { user };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @SuccessResponse(201, 'Created')
  public async createUser(@Body() body: CreateUserRequest): Promise<{ user: User }> {
    try {
      const user = this.usersService.addUser(body.name);
      this.setStatus(201);
      return { user };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }

  @Delete('{id}')
  public async deleteUser(@Path() id: string): Promise<void> {
    try {
      this.usersService.deleteUser(id);
      this.setStatus(204);
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }
}