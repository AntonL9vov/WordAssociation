import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from '../../services/usersService';
import { UsersStorage } from '../../storages/usersStorage';
import { TestDataFactory } from '../testDataFactory';
import { User } from '../../types/users';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUsersStorage: UsersStorage;

  beforeEach(() => {
    mockUsersStorage = new UsersStorage();
    usersService = new UsersService(mockUsersStorage);
  });

  describe('getUser', () => {
    it('should return user when it exists', async () => {
      const user = TestDataFactory.createUser();
      vi.spyOn(mockUsersStorage, 'getUser').mockResolvedValue(user);

      const result = await usersService.getUser(user.id);

      expect(result).toEqual(user);
      expect(mockUsersStorage.getUser).toHaveBeenCalledWith(user.id);
    });

    it('should return undefined when user does not exist', async () => {
      vi.spyOn(mockUsersStorage, 'getUser').mockResolvedValue(undefined);

      const result = await usersService.getUser('non-existent');

      expect(result).toBeUndefined();
      expect(mockUsersStorage.getUser).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('addUser', () => {
    it('should create user with provided name', async () => {
      const userName = 'John Doe';
      const expectedUser = TestDataFactory.createUser({ name: userName });
      vi.spyOn(mockUsersStorage, 'addUser').mockResolvedValue(expectedUser);

      const result = await usersService.addUser(userName);

      expect(result).toEqual(expectedUser);
      expect(mockUsersStorage.addUser).toHaveBeenCalledWith({ name: userName });
    });

    it('should delegate to storage with correct parameters', async () => {
      const userName = 'Jane Smith';
      const expectedUser = TestDataFactory.createUser({ name: userName });
      vi.spyOn(mockUsersStorage, 'addUser').mockResolvedValue(expectedUser);

      await usersService.addUser(userName);

      expect(mockUsersStorage.addUser).toHaveBeenCalledWith({ name: userName });
    });
  });

  describe('updateUser', () => {
    it('should update user and return result', async () => {
      const user = TestDataFactory.createUser();
      vi.spyOn(mockUsersStorage, 'updateUser').mockResolvedValue(user);

      const result = await usersService.updateUser(user);

      expect(result).toEqual(user);
      expect(mockUsersStorage.updateUser).toHaveBeenCalledWith(user);
    });

    it('should pass user object directly to storage', async () => {
      const user = TestDataFactory.createUser({ name: 'Updated Name' });
      vi.spyOn(mockUsersStorage, 'updateUser').mockResolvedValue(user);

      await usersService.updateUser(user);

      expect(mockUsersStorage.updateUser).toHaveBeenCalledWith(user);
    });
  });

  describe('deleteUser', () => {
    it('should delete user by id', async () => {
      const userId = 'user-to-delete';
      vi.spyOn(mockUsersStorage, 'deleteUser').mockResolvedValue(undefined);

      await usersService.deleteUser(userId);

      expect(mockUsersStorage.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should not return anything', async () => {
      const userId = 'user-to-delete';
      vi.spyOn(mockUsersStorage, 'deleteUser').mockResolvedValue(undefined);

      const result = await usersService.deleteUser(userId);

      expect(result).toBeUndefined();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users from storage', async () => {
      const users = TestDataFactory.createUsers(3);
      vi.spyOn(mockUsersStorage, 'getAllUsers').mockResolvedValue(users);

      const result = await usersService.getAllUsers();

      expect(result).toEqual(users);
      expect(mockUsersStorage.getAllUsers).toHaveBeenCalled();
    });

    it('should return empty array when no users', async () => {
      vi.spyOn(mockUsersStorage, 'getAllUsers').mockResolvedValue([]);

      const result = await usersService.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('integration with real storage', () => {
    let realUsersService: UsersService;

    beforeEach(() => {
      realUsersService = new UsersService(new UsersStorage());
    });

    it('should create, retrieve, update and delete users', async () => {
      // Create user
      const createdUser = await realUsersService.addUser('Integration Test User');
      expect(createdUser.name).toBe('Integration Test User');
      expect(createdUser.id).toBeTruthy();

      // Retrieve user
      const retrievedUser = await realUsersService.getUser(createdUser.id);
      expect(retrievedUser).toEqual(createdUser);

      // Update user
      const updatedUser = { ...createdUser, name: 'Updated Name' };
      const updateResult = await realUsersService.updateUser(updatedUser);
      expect(updateResult.name).toBe('Updated Name');

      // Verify update persisted
      const retrievedUpdatedUser = await realUsersService.getUser(createdUser.id);
      expect(retrievedUpdatedUser?.name).toBe('Updated Name');

      // Delete user
      await realUsersService.deleteUser(createdUser.id);
      const deletedUser = await realUsersService.getUser(createdUser.id);
      expect(deletedUser).toBeUndefined();
    });

    it('should handle multiple users correctly', async () => {
      const user1 = await realUsersService.addUser('User 1');
      const user2 = await realUsersService.addUser('User 2');
      const user3 = await realUsersService.addUser('User 3');

      const allUsers = await realUsersService.getAllUsers();
      expect(allUsers).toHaveLength(3);
      expect(allUsers).toContain(user1);
      expect(allUsers).toContain(user2);
      expect(allUsers).toContain(user3);
    });
  });
});