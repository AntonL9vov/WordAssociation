"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
class UsersService {
    constructor(usersStorage) {
        this.usersStorage = usersStorage;
    }
    async getUser(id) {
        return await this.usersStorage.getUser(id);
    }
    async addUser(name) {
        return await this.usersStorage.addUser({ name });
    }
    async updateUser(user) {
        return await this.usersStorage.updateUser(user);
    }
    async deleteUser(id) {
        await this.usersStorage.deleteUser(id);
    }
    async getAllUsers() {
        return await this.usersStorage.getAllUsers();
    }
}
exports.UsersService = UsersService;
