"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServices = void 0;
const gamesStorage_1 = require("../storages/gamesStorage");
const usersStorage_1 = require("../storages/usersStorage");
const gameService_1 = require("./gameService");
const usersService_1 = require("./usersService");
const createServices = () => {
    const usersStorage = new usersStorage_1.UsersStorage();
    const usersService = new usersService_1.UsersService(usersStorage);
    const gamesStorage = new gamesStorage_1.GamesStorage();
    const gamesService = new gameService_1.GameService(gamesStorage, usersService);
    return { usersService, gamesService };
};
exports.createServices = createServices;
