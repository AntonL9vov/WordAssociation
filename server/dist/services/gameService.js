"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const uuid_1 = require("uuid");
class GameService {
    constructor(gamesStorage, usersService) {
        this.gamesStorage = gamesStorage;
        this.usersService = usersService;
    }
    async getGame(gameId) {
        const game = await this.gamesStorage.getGame(gameId);
        if (!game) {
            throw new Error(`Game ${gameId} not found`);
        }
        return game;
    }
    async getGames() {
        return await this.gamesStorage.getGames();
    }
    async getPlayer(playerId) {
        const player = await this.usersService.getUser(playerId);
        if (!player) {
            throw new Error(`Player ${playerId} not found`);
        }
        return player;
    }
    async isPlayerInGame(gameId, playerId) {
        const game = await this.getGame(gameId);
        const player = game.players.find((p) => p.id === playerId);
        if (!player) {
            return null;
        }
        return game;
    }
    async isPlayerInGameByPlayerId(playerId) {
        const games = await this.gamesStorage.getGames();
        const game = games.find((g) => g.players.some((p) => p.id === playerId));
        if (!game) {
            return null;
        }
        return game;
    }
    async getLastRound(gameId) {
        const game = await this.getGame(gameId);
        if (!game.rounds.length) {
            throw new Error(`Game ${gameId} has no rounds`);
        }
        return game.rounds[game.rounds.length - 1];
    }
    async startGame(gameId, startWord) {
        const game = await this.getGame(gameId);
        if (game.players.length < 2) {
            throw new Error(`Game ${gameId} has less than 2 players`);
        }
        if (game.status === "started") {
            throw new Error(`Game ${gameId} is already started`);
        }
        await this.gamesStorage.updateGame(game.id, {
            status: "started",
            startWord,
        });
        await this.addRound(gameId);
        return await this.getGame(gameId);
    }
    async createGame(playerId) {
        const game = await this.gamesStorage.createGame();
        await this.addPlayerToGame(game.id, playerId);
        const updatedGame = await this.gamesStorage.getGame(game.id);
        return updatedGame ?? game;
    }
    async deleteGame(gameId) {
        await this.gamesStorage.deleteGame(gameId);
    }
    async addPlayerToGame(gameId, playerId) {
        const game = await this.getGame(gameId);
        const player = await this.getPlayer(playerId);
        if (game.status === "started") {
            throw new Error(`Game ${gameId} is already started`);
        }
        if (game.status === "finished") {
            throw new Error(`Game ${gameId} is finished`);
        }
        if (await this.isPlayerInGame(gameId, playerId)) {
            throw new Error(`Player ${playerId} already in game ${gameId}`);
        }
        const updatedGame = await this.gamesStorage.updateGame(gameId, {
            players: [...game.players, player],
        });
        return updatedGame;
    }
    async emitWord(gameId, w, playerId) {
        const game = await this.getGame(gameId);
        const player = await this.getPlayer(playerId);
        if (game.playersEmittedWords[playerId]) {
            throw new Error(`Player ${playerId} already emitted word`);
        }
        if (game.status !== "started") {
            throw new Error(`Game ${gameId} is not started or finished`);
        }
        if (!game.players.find((p) => p.id === playerId)) {
            throw new Error(`Player ${playerId} is not in game ${gameId}`);
        }
        const word = {
            id: (0, uuid_1.v4)(),
            word: w,
            playerId,
            playerName: player.name,
            timestamp: new Date(),
        };
        const lastRound = await this.getLastRound(gameId);
        // Check if gamesStorage has specific addWordToRound method (PostgreSQL implementation)
        if ('addWordToRound' in this.gamesStorage && typeof this.gamesStorage.addWordToRound === 'function') {
            await this.gamesStorage.addWordToRound(lastRound.id, word);
        }
        else {
            // Fallback for in-memory storage
            lastRound.words?.push(word);
        }
        await this.gamesStorage.updateGame(gameId, {
            playersEmittedWords: {
                ...game.playersEmittedWords,
                [playerId]: w,
            },
        });
        await this.checkLastRound(gameId);
        const updatedGame = await this.getGame(gameId);
        return {
            game: updatedGame,
            playersEmittedWords: updatedGame.playersEmittedWords,
        };
    }
    async checkIsRoundFinished(gameId) {
        const lastRound = await this.getLastRound(gameId);
        const game = await this.getGame(gameId);
        return lastRound.words?.length === game.players.length;
    }
    async checkIsGameFinished(gameId) {
        const lastRound = await this.getLastRound(gameId);
        const game = await this.getGame(gameId);
        if (lastRound.words.length < game.players.length) {
            return false;
        }
        return lastRound.words?.every((word) => word.word === lastRound.words[0].word);
    }
    async finishGame(gameId) {
        const game = await this.getGame(gameId);
        await this.gamesStorage.updateGame(game.id, {
            status: "finished",
        });
    }
    async addRound(gameId) {
        // Check if gamesStorage has specific addRound method (PostgreSQL implementation)
        if ('addRound' in this.gamesStorage && typeof this.gamesStorage.addRound === 'function') {
            await this.gamesStorage.addRound(gameId, true); // Clear submissions for new round
            return;
        }
        // Fallback for in-memory storage
        const game = await this.getGame(gameId);
        const newRounds = [];
        if (game.rounds.length) {
            newRounds.push(...game.rounds);
        }
        newRounds.push({
            id: (0, uuid_1.v4)(),
            words: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.gamesStorage.updateGame(game.id, {
            rounds: newRounds,
            playersEmittedWords: {},
        });
    }
    async checkLastRound(gameId) {
        const isRoundFinished = await this.checkIsRoundFinished(gameId);
        if (!isRoundFinished) {
            return false;
        }
        const isGameFinished = await this.checkIsGameFinished(gameId);
        if (isGameFinished) {
            await this.finishGame(gameId);
            return true;
        }
        await this.addRound(gameId);
        return false;
    }
    async getGamePlayers(gameId) {
        const game = await this.getGame(gameId);
        return game.players;
    }
    async deletePlayerFromGame(gameId, playerId) {
        const game = await this.getGame(gameId);
        game.players = game.players.filter((player) => player.id !== playerId);
        return await this.gamesStorage.updateGame(game.id, game);
    }
    async deleteUserFromAllGames(userId) {
        const games = await this.gamesStorage.getGames();
        const updatedGames = [];
        for (const game of games) {
            const playersLength = game.players.length;
            game.players = game.players.filter((player) => player.id !== userId);
            if (playersLength > game.players.length) {
                const updatedGame = await this.gamesStorage.updateGame(game.id, game);
                updatedGames.push(updatedGame);
            }
        }
        return updatedGames;
    }
    async restartGame(gameId) {
        const game = await this.getGame(gameId);
        await this.gamesStorage.updateGame(game.id, {
            status: "created",
            rounds: [],
            startWord: "",
            playersEmittedWords: {}, // Reset players emitted words on restart
        });
        return await this.getGame(gameId);
    }
}
exports.GameService = GameService;
