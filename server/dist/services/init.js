"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServices = void 0;
const gamesStorage_1 = require("../storages/gamesStorage");
const usersStorage_1 = require("../storages/usersStorage");
const gamesStorage_2 = require("../storages/postgres/gamesStorage");
const usersStorage_2 = require("../storages/postgres/usersStorage");
const gameService_1 = require("./gameService");
const usersService_1 = require("./usersService");
const storage_1 = require("../config/storage");
const database_1 = require("../config/database");
const createServices = async () => {
    const storageConfig = (0, storage_1.getStorageConfig)();
    let usersStorage;
    let gamesStorage;
    if (storageConfig.type === 'postgres') {
        // Test database connection first
        const dbConnection = database_1.DatabaseConnection.getInstance();
        const isConnected = await dbConnection.testConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to PostgreSQL database');
        }
        console.log('Using PostgreSQL storage');
        usersStorage = new usersStorage_2.PostgresUsersStorage();
        gamesStorage = new gamesStorage_2.PostgresGamesStorage();
    }
    else {
        console.log('Using in-memory storage');
        usersStorage = new usersStorage_1.UsersStorage();
        gamesStorage = new gamesStorage_1.GamesStorage();
    }
    const usersService = new usersService_1.UsersService(usersStorage);
    const gamesService = new gameService_1.GameService(gamesStorage, usersService);
    return { usersService, gamesService };
};
exports.createServices = createServices;
