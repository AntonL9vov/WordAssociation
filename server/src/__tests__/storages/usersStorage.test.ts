import { describe, it, expect, beforeEach } from 'vitest';
import { UsersStorage } from '../../storages/usersStorage';
import { TestDataFactory } from '../testDataFactory';
import { User } from '../../types/users';

describe('UsersStorage', () => {
  let usersStorage: UsersStorage;

  beforeEach(() => {
    usersStorage = new UsersStorage();
  });

  describe('constructor', () => {
    it('should initialize with empty users array by default', async () => {
      const storage = new UsersStorage();
      const users = await storage.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should initialize with provided initial state', async () => {
      const user1 = TestDataFactory.createUser();
      const user2 = TestDataFactory.createUser();
      const initialUsers = [user1, user2];
      
      const storage = new UsersStorage(initialUsers);
      const users = await storage.getAllUsers();
      
      expect(users).toHaveLength(2);
      expect(users).toContain(user1);
      expect(users).toContain(user2);
    });
  });

  describe('addUser', () => {
    it('should add a user and return it with generated id', async () => {
      const userData = { name: 'John Doe' };
      const user = await usersStorage.addUser(userData);

      expect(user).toMatchObject(userData);
      expect(user.id).toBeTruthy();
      expect(typeof user.id).toBe('string');
    });

    it('should add user to internal storage', async () => {
      const userData = { name: 'Jane Smith' };
      const user = await usersStorage.addUser(userData);
      
      const allUsers = await usersStorage.getAllUsers();
      const foundUser = await usersStorage.getUser(user.id);
      expect(allUsers).toContain(user);
      expect(foundUser).toEqual(user);
    });

    it('should generate unique ids for multiple users', async () => {
      const user1 = await usersStorage.addUser({ name: 'User 1' });
      const user2 = await usersStorage.addUser({ name: 'User 2' });

      expect(user1.id).not.toEqual(user2.id);
    });
  });

  describe('getUser', () => {
    it('should return user by id when exists', async () => {
      const user = await usersStorage.addUser({ name: 'Test User' });
      const foundUser = await usersStorage.getUser(user.id);

      expect(foundUser).toEqual(user);
    });

    it('should return undefined when user does not exist', async () => {
      const foundUser = await usersStorage.getUser('non-existent-id');
      expect(foundUser).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update existing user', async () => {
      const user = await usersStorage.addUser({ name: 'Original Name' });
      const updatedUser: User = { ...user, name: 'Updated Name' };
      
      const result = await usersStorage.updateUser(updatedUser);
      const foundUser = await usersStorage.getUser(user.id);
      
      expect(result).toEqual(updatedUser);
      expect(foundUser).toEqual(updatedUser);
    });

    it('should return user even if not found in storage', async () => {
      const user: User = TestDataFactory.createUser({ name: 'Non-existent User' });
      const result = await usersStorage.updateUser(user);
      const foundUser = await usersStorage.getUser(user.id);
      
      expect(result).toEqual(user);
      // User should not be added to storage
      expect(foundUser).toBeUndefined();
    });

    it('should not affect other users', async () => {
      const user1 = await usersStorage.addUser({ name: 'User 1' });
      const user2 = await usersStorage.addUser({ name: 'User 2' });
      
      const updatedUser1 = { ...user1, name: 'Updated User 1' };
      await usersStorage.updateUser(updatedUser1);
      
      const foundUser2 = await usersStorage.getUser(user2.id);
      expect(foundUser2).toEqual(user2);
    });
  });

  describe('deleteUser', () => {
    it('should remove user from storage', async () => {
      const user = await usersStorage.addUser({ name: 'To Be Deleted' });
      
      await usersStorage.deleteUser(user.id);
      
      const foundUser = await usersStorage.getUser(user.id);
      const allUsers = await usersStorage.getAllUsers();
      expect(foundUser).toBeUndefined();
      expect(allUsers).not.toContain(user);
    });

    it('should not affect other users when deleting one', async () => {
      const user1 = await usersStorage.addUser({ name: 'User 1' });
      const user2 = await usersStorage.addUser({ name: 'User 2' });
      const user3 = await usersStorage.addUser({ name: 'User 3' });
      
      await usersStorage.deleteUser(user2.id);
      
      const allUsers = await usersStorage.getAllUsers();
      expect(allUsers).toEqual([user1, user3]);
    });

    it('should handle deletion of non-existent user gracefully', async () => {
      const initialUsers = await usersStorage.getAllUsers();
      
      await usersStorage.deleteUser('non-existent-id');
      
      const finalUsers = await usersStorage.getAllUsers();
      expect(finalUsers).toEqual(initialUsers);
    });
  });

  describe('getAllUsers', () => {
    it('should return empty array when no users', async () => {
      const users = await usersStorage.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should return all users', async () => {
      const user1 = await usersStorage.addUser({ name: 'User 1' });
      const user2 = await usersStorage.addUser({ name: 'User 2' });
      const user3 = await usersStorage.addUser({ name: 'User 3' });
      
      const allUsers = await usersStorage.getAllUsers();
      
      expect(allUsers).toHaveLength(3);
      expect(allUsers).toContain(user1);
      expect(allUsers).toContain(user2);
      expect(allUsers).toContain(user3);
    });
  });
});