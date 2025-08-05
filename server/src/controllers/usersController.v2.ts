import { Controller, Get, Post, Put, Delete, Route, Path, Body, Tags, Response, Example, SuccessResponse } from 'tsoa';
import { UsersService } from '../services/usersService';
import { User, CreateUserRequest, UpdateUserRequest, UsersResponse, UserResponse } from '../models/user.model';
import { ErrorResponse } from '../models/common.model';

@Route('api/users')
@Tags('Users')
export class UsersControllerV2 extends Controller {
  constructor(private usersService: UsersService) {
    super();
  }

  /**
   * Получить всех пользователей
   * @summary Get all users
   */
  @Get()
  @Response<ErrorResponse>(500, 'Internal server error')
  @Example<UsersResponse>({
    users: [
      { id: 'user-123', name: 'John Doe' },
      { id: 'user-456', name: 'Jane Smith' }
    ]
  })
  public async getAllUsers(): Promise<UsersResponse> {
    try {
      const users = this.usersService.getAllUsers();
      return { users };
    } catch (error) {
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Получить пользователя по ID
   * @summary Get user by ID
   */
  @Get('{id}')
  @Response<ErrorResponse>(404, 'User not found')
  @Response<ErrorResponse>(500, 'Internal server error')
  @Example<UserResponse>({
    user: { id: 'user-123', name: 'John Doe' }
  })
  public async getUserById(@Path() id: string): Promise<UserResponse> {
    try {
      const user = this.usersService.getUser(id);
      
      if (!user) {
        this.setStatus(404);
        throw new Error(`User with ID ${id} not found`);
      }

      return { user };
    } catch (error) {
      if (this.getStatus() === 404) {
        throw error;
      }
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Создать нового пользователя
   * @summary Create a new user
   */
  @Post()
  @SuccessResponse(201, 'User created successfully')
  @Response<ErrorResponse>(400, 'Bad request - invalid input')
  @Response<ErrorResponse>(500, 'Internal server error')
  @Example<UserResponse>({
    user: { id: 'user-123', name: 'John Doe' }
  })
  public async createUser(@Body() body: CreateUserRequest): Promise<UserResponse> {
    try {
      const { name } = body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        this.setStatus(400);
        throw new Error('Name is required and must be a non-empty string');
      }

      const user = this.usersService.addUser(name.trim());
      this.setStatus(201);
      return { user };
    } catch (error) {
      if (this.getStatus() === 400) {
        throw error;
      }
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Обновить пользователя
   * @summary Update user
   */
  @Put('{id}')
  @Response<ErrorResponse>(400, 'Bad request - invalid input')
  @Response<ErrorResponse>(404, 'User not found')
  @Response<ErrorResponse>(500, 'Internal server error')
  @Example<UserResponse>({
    user: { id: 'user-123', name: 'John Updated' }
  })
  public async updateUser(@Path() id: string, @Body() body: UpdateUserRequest): Promise<UserResponse> {
    try {
      const { name } = body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        this.setStatus(400);
        throw new Error('Name is required and must be a non-empty string');
      }

      const existingUser = this.usersService.getUser(id);
      if (!existingUser) {
        this.setStatus(404);
        throw new Error(`User with ID ${id} not found`);
      }

      const updatedUser = this.usersService.updateUser({ id, name: name.trim() });
      return { user: updatedUser };
    } catch (error) {
      if (this.getStatus() === 400 || this.getStatus() === 404) {
        throw error;
      }
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Удалить пользователя
   * @summary Delete user
   */
  @Delete('{id}')
  @SuccessResponse(204, 'User deleted successfully')
  @Response<ErrorResponse>(404, 'User not found')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async deleteUser(@Path() id: string): Promise<void> {
    try {
      const existingUser = this.usersService.getUser(id);
      if (!existingUser) {
        this.setStatus(404);
        throw new Error(`User with ID ${id} not found`);
      }

      this.usersService.deleteUser(id);
      this.setStatus(204);
    } catch (error) {
      if (this.getStatus() === 404) {
        throw error;
      }
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}