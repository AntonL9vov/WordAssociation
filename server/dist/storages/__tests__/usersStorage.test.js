"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const usersStorage_1 = require("../usersStorage");
(0, vitest_1.describe)('UsersStorage', () => {
    let usersStorage;
    (0, vitest_1.beforeEach)(() => {
        usersStorage = new usersStorage_1.UsersStorage();
    });
    (0, vitest_1.describe)('addUser', () => {
        (0, vitest_1.it)('should add a new user with generated UUID', () => {
            const userData = { name: 'Test User' };
            const user = usersStorage.addUser(userData);
            (0, vitest_1.expect)(user).toHaveProperty('id');
            (0, vitest_1.expect)(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            (0, vitest_1.expect)(user.name).toBe(userData.name);
        });
    });
    (0, vitest_1.describe)('getUserById', () => {
        (0, vitest_1.it)('should return undefined for non-existent user', () => {
            const user = usersStorage.getUser('non-existent-id');
            (0, vitest_1.expect)(user).toBeUndefined();
        });
        (0, vitest_1.it)('should return user by id', () => {
            const userData = { name: 'Test User' };
            const addedUser = usersStorage.addUser(userData);
            const retrievedUser = usersStorage.getUser(addedUser.id);
            (0, vitest_1.expect)(retrievedUser).toBeDefined();
            (0, vitest_1.expect)(retrievedUser).toEqual(addedUser);
        });
    });
    (0, vitest_1.describe)('updateUser', () => {
        (0, vitest_1.it)('should update existing user', () => {
            const userData = { name: 'Test User' };
            const addedUser = usersStorage.addUser(userData);
            const updatedUser = { ...addedUser, name: 'Updated Name' };
            const result = usersStorage.updateUser(updatedUser);
            (0, vitest_1.expect)(result).toEqual(updatedUser);
            const retrievedUser = usersStorage.getUser(addedUser.id);
            (0, vitest_1.expect)(retrievedUser).toEqual(updatedUser);
        });
        (0, vitest_1.it)('should return the same user if user does not exist', () => {
            const nonExistentUser = {
                id: 'non-existent-id',
                name: 'Test User'
            };
            const result = usersStorage.updateUser(nonExistentUser);
            (0, vitest_1.expect)(result).toEqual(nonExistentUser);
        });
    });
    (0, vitest_1.describe)('deleteUser', () => {
        (0, vitest_1.it)('should delete existing user', () => {
            const userData = { name: 'Test User' };
            const addedUser = usersStorage.addUser(userData);
            usersStorage.deleteUser(addedUser.id);
            const retrievedUser = usersStorage.getUser(addedUser.id);
            (0, vitest_1.expect)(retrievedUser).toBeUndefined();
        });
        (0, vitest_1.it)('should not throw error when deleting non-existent user', () => {
            (0, vitest_1.expect)(() => {
                usersStorage.deleteUser('non-existent-id');
            }).not.toThrow();
        });
    });
});
