"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSocketEvents = void 0;
exports.gameSocketEvents = {
    create: {
        handler: {
            "game:create": {
                event: "game:create",
                callback: (socket, gameService, playerId) => {
                    try {
                        const game = gameService.createGame(playerId);
                        exports.gameSocketEvents.create.emit["game:created"].callback(socket, game);
                    }
                    catch (error) {
                        exports.gameSocketEvents.create.emit["game:created:error"].callback(socket, error);
                    }
                },
            },
        },
        emit: {
            "game:created": {
                event: "game:created",
                callback: (socket, game) => {
                    socket.emit(exports.gameSocketEvents.create.emit["game:created"].event, game);
                },
            },
            "game:created:error": {
                event: "game:created:error",
                callback: (socket, error) => {
                    socket.emit(exports.gameSocketEvents.create.emit["game:created:error"].event, error.message);
                },
            },
        },
    },
    start: {
        handler: {
            "game:start": {
                event: "game:start",
                callback: (socket, gameService, gameId, startWord) => {
                    try {
                        gameService.startGame(gameId, startWord);
                        const game = gameService.getGame(gameId);
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
                    socket.emit(exports.gameSocketEvents.start.emit["game:started"].event, game);
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
    join: {
        handler: {
            "game:join": {
                event: "game:join",
                callback: (socket, gameService, gameId, playerId) => {
                    try {
                        console.log("game:join", gameId, playerId);
                        gameService.addPlayerToGame(gameId, playerId);
                        exports.gameSocketEvents.join.emit["game:joined"].callback(socket, gameId, playerId);
                    }
                    catch (error) {
                        exports.gameSocketEvents.join.emit["game:joined:error"].callback(socket, error);
                    }
                },
            },
        },
        emit: {
            "game:joined": {
                event: "game:joined",
                callback: (socket, gameId, playerId) => {
                    socket.emit(exports.gameSocketEvents.join.emit["game:joined"].event, gameId, playerId);
                },
            },
            "game:joined:error": {
                event: "game:joined:error",
                callback: (socket, error) => {
                    socket.emit(exports.gameSocketEvents.join.emit["game:joined:error"].event, error.message);
                },
            },
        },
    },
    get: {
        handler: {
            "game:get": {
                event: "game:get",
                callback: (socket, gameService, gameId) => {
                    const game = gameService.getGame(gameId);
                    exports.gameSocketEvents.get.emit["game:got"].callback(socket, game);
                },
            },
        },
        emit: {
            "game:got": {
                event: "game:got",
                callback: (socket, game) => {
                    socket.emit(exports.gameSocketEvents.get.emit["game:got"].event, game);
                },
            },
        },
    },
    word: {
        handler: {
            "game:word": {
                event: "game:word",
                callback: (socket, gameService, gameId, playerId, word) => {
                    try {
                        const emittedWord = gameService.emitWord(gameId, word, playerId);
                        exports.gameSocketEvents.word.emit["game:word:emitted"].callback(socket, emittedWord);
                    }
                    catch (error) {
                        exports.gameSocketEvents.word.emit["game:word:emitted:error"].callback(socket, error);
                    }
                },
            },
        },
        emit: {
            "game:word:emitted": {
                event: "game:word:emitted",
                callback: (socket, word) => {
                    socket.emit(exports.gameSocketEvents.word.emit["game:word:emitted"].event, word);
                },
            },
            "game:word:emitted:error": {
                event: "game:word:emitted:error",
                callback: (socket, error) => {
                    socket.emit(exports.gameSocketEvents.word.emit["game:word:emitted:error"].event, error.message);
                },
            },
        },
    },
};
