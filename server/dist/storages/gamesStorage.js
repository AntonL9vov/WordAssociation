"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesStorage = void 0;
const uuid_1 = require("uuid");
class GamesStorage {
    constructor(initialState = {}) {
        this.games = initialState;
    }
    async getGame(gameId) {
        return this.games[gameId];
    }
    async createGame() {
        const game = {
            id: (0, uuid_1.v4)(),
            rounds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            startWord: "",
            status: "created",
            players: [],
            playersEmittedWords: {},
        };
        this.games[game.id] = game;
        return game;
    }
    async deleteGame(gameId) {
        delete this.games[gameId];
    }
    async getGames() {
        return Object.values(this.games);
    }
    async updateGame(gameId, game) {
        this.games[gameId] = {
            ...this.games[gameId],
            ...game,
            updatedAt: new Date(),
        };
        return this.games[gameId];
    }
}
exports.GamesStorage = GamesStorage;
