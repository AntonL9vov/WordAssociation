"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSocketEvents = void 0;
exports.gameSocketEvents = {
    start: {
        handler: {
            "game:start": {
                event: "game:start",
                callback: async (socket, gameService, gameId, startWord) => {
                    try {
                        await gameService.startGame(gameId, startWord);
                        const game = await gameService.getGame(gameId);
                        exports.gameSocketEvents.start.emit["game:started"].callback(socket, game);
                    }
                    catch (error) {
                        exports.gameSocketEvents.start.emit["game:started:error"].callback(socket, error);
                    }
                },
            },
        },
        emit: {
            "game:started": {
                event: "game:started",
                callback: (socket, game) => {
                    const room = `game:${game.id}`;
                    socket.nsp
                        .to(room)
                        .emit(exports.gameSocketEvents.start.emit["game:started"].event, game);
                },
            },
            "game:started:error": {
                event: "game:started:error",
                callback: (socket, error) => {
                    socket.emit(exports.gameSocketEvents.start.emit["game:started:error"].event, error.message);
                },
            },
        },
    },
    word: {
        handler: {
            "game:word": {
                event: "game:word",
                callback: async (socket, gameService, gameId, playerId, word) => {
                    try {
                        const oldGame = await gameService.getGame(gameId);
                        const { game, playersEmittedWords } = await gameService.emitWord(gameId, word, playerId);
                        const isGameFinished = await gameService.checkIsGameFinished(gameId);
                        if (isGameFinished) {
                            exports.gameSocketEvents.game.emit["game:finished"].callback(socket, game);
                            return;
                        }
                        const isRoundFinished = oldGame?.rounds.length === game.rounds.length - 1;
                        if (isRoundFinished) {
                            exports.gameSocketEvents.round.emit["game:round:finished"].callback(socket, game);
                            return;
                        }
                        exports.gameSocketEvents.word.emit["game:word"].callback(socket, gameId, playersEmittedWords);
                    }
                    catch (error) {
                        console.error("Error emitting word:", error);
                    }
                },
            },
        },
        emit: {
            "game:word": {
                event: "game:word",
                callback: (socket, gameId, playersEmittedWords) => {
                    const room = `game:${gameId}`;
                    console.log("🔥 Players emitted words:", playersEmittedWords);
                    socket.nsp.to(room).emit(exports.gameSocketEvents.word.emit["game:word"].event, playersEmittedWords);
                },
            },
        },
    },
    round: {
        handler: {},
        emit: {
            "game:round:finished": {
                event: "game:round:finished",
                callback: (socket, game) => {
                    const room = `game:${game.id}`;
                    socket.nsp
                        .to(room)
                        .emit(exports.gameSocketEvents.round.emit["game:round:finished"].event, game);
                },
            },
        },
    },
    game: {
        handler: {},
        emit: {
            "game:finished": {
                event: "game:finished",
                callback: (socket, game) => {
                    const room = `game:${game.id}`;
                    socket.nsp
                        .to(room)
                        .emit(exports.gameSocketEvents.game.emit["game:finished"].event, game);
                },
            },
        },
    },
    joinRoom: {
        handler: {
            "game:join:room": {
                event: "game:join:room",
                callback: async (socket, gameService, gameId, playerId) => {
                    try {
                        console.log("🔥 Player joining room:", playerId, "to game:", gameId);
                        const room = `game:${gameId}`;
                        socket.join(room);
                        console.log("✅ Player joined room:", room, "Socket ID:", socket.id);
                        // Get current game state and send it back to the client who joined
                        const game = await gameService.getGame(gameId);
                        if (!game) {
                            throw new Error("Game not found");
                        }
                        socket.emit("game:room:joined", game);
                        console.log("📤 Sent current game state to joined player:", game.players.length, "players");
                        // Notify all other players in the room about the updated game state
                        socket.to(room).emit("game:players:updated", game);
                        console.log("📤 Broadcasted game update to room:", room, "with", game.players.length, "players");
                    }
                    catch (error) {
                        console.error("Error joining room:", error);
                        const errorMessage = error instanceof Error ? error.message : "Unknown error";
                        socket.emit("game:room:join:error", errorMessage);
                    }
                },
            },
        },
        emit: {
            "game:players:updated": {
                event: "game:players:updated",
                callback: (socket, game) => {
                    const room = `game:${game.id}`;
                    socket.nsp
                        .to(room)
                        .emit(exports.gameSocketEvents.joinRoom.emit["game:players:updated"].event, game);
                },
            },
        },
    },
};
