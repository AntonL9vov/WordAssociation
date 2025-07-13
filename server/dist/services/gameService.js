"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const uuid_1 = require("uuid");
class GameService {
    constructor(gamesStorage, usersService) {
        this.gamesStorage = gamesStorage;
        this.usersService = usersService;
    }
    getGame(gameId) {
        const game = this.gamesStorage.getGame(gameId);
        if (!game) {
            throw new Error(`Game ${gameId} not found`);
        }
        return game;
    }
    getPlayer(playerId) {
        const player = this.usersService.getUser(playerId);
        if (!player) {
            throw new Error(`Player ${playerId} not found`);
        }
        return player;
    }
    isPlayerInGame(gameId, playerId) {
        const game = this.getGame(gameId);
        return game.players.some((p) => p.id === playerId);
    }
    getLastRound(gameId) {
        const game = this.getGame(gameId);
        if (!game.rounds.length) {
            throw new Error(`Game ${gameId} has no rounds`);
        }
        return game.rounds[game.rounds.length - 1];
    }
    startGame(gameId, startWord) {
        const game = this.getGame(gameId);
        if (game.isStarted) {
            throw new Error(`Game ${gameId} is already started`);
        }
        this.gamesStorage.updateGame(game.id, {
            isStarted: true,
            startWord,
        });
        this.addRound(gameId);
    }
    createGame(playerId) {
        const game = this.gamesStorage.createGame();
        this.addPlayerToGame(game.id, playerId);
        return this.gamesStorage.getGame(game.id) ?? game;
    }
    deleteGame(gameId) {
        this.gamesStorage.deleteGame(gameId);
    }
    addPlayerToGame(gameId, playerId) {
        const game = this.getGame(gameId);
        const player = this.getPlayer(playerId);
        if (this.isPlayerInGame(gameId, playerId)) {
            throw new Error(`Player ${playerId} already in game ${gameId}`);
        }
        this.gamesStorage.updateGame(gameId, {
            players: [...game.players, player],
        });
        return game;
    }
    emitWord(gameId, w, playerId) {
        const game = this.getGame(gameId);
        const player = this.getPlayer(playerId);
        if (!game.isStarted || game.isFinished) {
            throw new Error(`Game ${gameId} is not started or finished`);
        }
        const word = {
            id: (0, uuid_1.v4)(),
            word: w,
            playerId,
            playerName: player.name,
            timestamp: new Date(),
        };
        const lastRound = this.getLastRound(gameId);
        lastRound.words?.push(word);
        this.gamesStorage.updateGame(gameId, {
            rounds: game.rounds,
        });
        this.checkLastRound(gameId);
        return word;
    }
    checkIsRoundFinished(gameId) {
        const lastRound = this.getLastRound(gameId);
        return lastRound.words?.length === this.getGame(gameId).players.length;
    }
    checkIsGameFinished(gameId) {
        const lastRound = this.getLastRound(gameId);
        return lastRound.words?.every((word) => word.word === lastRound.words[0].word);
    }
    finishGame(gameId) {
        const game = this.getGame(gameId);
        this.gamesStorage.updateGame(game.id, {
            isFinished: true,
        });
    }
    addRound(gameId) {
        const game = this.getGame(gameId);
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
        this.gamesStorage.updateGame(game.id, {
            rounds: newRounds,
        });
    }
    checkLastRound(gameId) {
        const isRoundFinished = this.checkIsRoundFinished(gameId);
        if (!isRoundFinished) {
            return false;
        }
        const isGameFinished = this.checkIsGameFinished(gameId);
        if (isGameFinished) {
            this.finishGame(gameId);
            return true;
        }
        this.addRound(gameId);
        return false;
    }
}
exports.GameService = GameService;
