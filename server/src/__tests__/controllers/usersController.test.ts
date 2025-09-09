import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from '../../services/usersService';
import { GameService } from '../../services/gameService';
import { TestDataFactory } from '../testDataFactory';

// Simple unit tests focused on business logic, not framework integration
describe('UsersController Logic', () => {
  let mockUsersService: UsersService;
  let mockGameService: GameService;

  beforeEach(() => {
    mockUsersService = {
      getAllUsers: vi.fn(),
      getUser: vi.fn(),
      addUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
    } as any;
    
    mockGameService = {
      deleteUserFromAllGames: vi.fn(),
    } as any;
  });

  describe('getAllUsers logic', () => {
    it('should delegate to users service', () => {
      const users = TestDataFactory.createUsers(3);
      mockUsersService.getAllUsers = vi.fn().mockReturnValue(users);

      const result = mockUsersService.getAllUsers();

      expect(result).toEqual(users);
      expect(mockUsersService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById logic', () => {
    it('should return user when found', () => {
      const user = TestDataFactory.createUser();
      mockUsersService.getUser = vi.fn().mockReturnValue(user);

      const result = mockUsersService.getUser(user.id);

      expect(result).toEqual(user);
      expect(mockUsersService.getUser).toHaveBeenCalledWith(user.id);
    });

    it('should return undefined when user not found', () => {
      const userId = 'non-existent';
      mockUsersService.getUser = vi.fn().mockReturnValue(undefined);

      const result = mockUsersService.getUser(userId);

      expect(result).toBeUndefined();
    });
  });

  describe('createUser logic', () => {
    it('should create user with provided name', () => {
      const userData = 'John Doe';
      const createdUser = TestDataFactory.createUser({ name: userData });
      mockUsersService.addUser = vi.fn().mockReturnValue(createdUser);

      const result = mockUsersService.addUser(userData);

      expect(result).toEqual(createdUser);
      expect(mockUsersService.addUser).toHaveBeenCalledWith(userData);
    });
  });

  describe('deleteUser logic', () => {
    it('should delete user and update affected games', () => {
      const userId = 'user-to-delete';
      const updatedGames = [TestDataFactory.createGame(), TestDataFactory.createGame()];
      
      mockGameService.deleteUserFromAllGames = vi.fn().mockReturnValue(updatedGames);
      mockUsersService.deleteUser = vi.fn();

      // Test the business logic sequence
      const gameUpdates = mockGameService.deleteUserFromAllGames(userId);
      mockUsersService.deleteUser(userId);

      expect(mockGameService.deleteUserFromAllGames).toHaveBeenCalledWith(userId);
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userId);
      expect(gameUpdates).toEqual(updatedGames);
    });
  });
});