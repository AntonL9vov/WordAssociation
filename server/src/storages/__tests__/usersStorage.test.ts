import { describe, it, expect, beforeEach } from 'vitest';
import { UsersStorage } from '../usersStorage';
import { User } from '../../types/users';

describe('UsersStorage', () => {
  let usersStorage: UsersStorage;

  beforeEach(() => {
    usersStorage = new UsersStorage();
  });

  describe('addUser', () => {
    it('should add a new user with generated UUID', () => {
      const userData = { name: 'Test User' };
      const user = usersStorage.addUser(userData);

      expect(user).toHaveProperty('id');
      expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(user.name).toBe(userData.name);
    });
  });

  describe('getUserById', () => {
    it('should return undefined for non-existent user', () => {
      const user = usersStorage.getUserById('non-existent-id');
      expect(user).toBeUndefined();
    });

    it('should return user by id', () => {
      const userData = { name: 'Test User' };
      const addedUser = usersStorage.addUser(userData);
      const retrievedUser = usersStorage.getUserById(addedUser.id);

      expect(retrievedUser).toBeDefined();
      expect(retrievedUser).toEqual(addedUser);
    });
  });

  describe('updateUser', () => {
    it('should update existing user', () => {
      const userData = { name: 'Test User' };
      const addedUser = usersStorage.addUser(userData);
      const updatedUser = { ...addedUser, name: 'Updated Name' };

      const result = usersStorage.updateUser(updatedUser);
      expect(result).toEqual(updatedUser);

      const retrievedUser = usersStorage.getUserById(addedUser.id);
      expect(retrievedUser).toEqual(updatedUser);
    });

    it('should return the same user if user does not exist', () => {
      const nonExistentUser: User = {
        id: 'non-existent-id',
        name: 'Test User'
      };

      const result = usersStorage.updateUser(nonExistentUser);
      expect(result).toEqual(nonExistentUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', () => {
      const userData = { name: 'Test User' };
      const addedUser = usersStorage.addUser(userData);

      usersStorage.deleteUser(addedUser.id);
      const retrievedUser = usersStorage.getUserById(addedUser.id);
      expect(retrievedUser).toBeUndefined();
    });

    it('should not throw error when deleting non-existent user', () => {
      expect(() => {
        usersStorage.deleteUser('non-existent-id');
      }).not.toThrow();
    });
  });
}); 