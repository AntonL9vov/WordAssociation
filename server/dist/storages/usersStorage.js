"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersStorage = void 0;
const uuid_1 = require("uuid");
class UsersStorage {
    constructor(initialState = []) {
        this.users = initialState;
    }
    async getUser(id) {
        return this.users.find((user) => user.id === id);
    }
    async addUser(user) {
        const newUser = { id: (0, uuid_1.v4)(), ...user };
        this.users.push(newUser);
        return newUser;
    }
    async updateUser(user) {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
        return user;
    }
    async deleteUser(id) {
        this.users = this.users.filter((user) => user.id !== id);
    }
    async getAllUsers() {
        return this.users;
    }
}
exports.UsersStorage = UsersStorage;
