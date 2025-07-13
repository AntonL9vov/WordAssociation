"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
class UsersService {
    constructor(usersStorage) {
        this.usersStorage = usersStorage;
    }
    getUser(id) {
        return this.usersStorage.getUser(id);
    }
    addUser(name) {
        return this.usersStorage.addUser({ name });
    }
    updateUser(user) {
        return this.usersStorage.updateUser(user);
    }
    deleteUser(id) {
        this.usersStorage.deleteUser(id);
    }
}
exports.UsersService = UsersService;
