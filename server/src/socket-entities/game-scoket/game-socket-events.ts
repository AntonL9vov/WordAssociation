import { Socket } from "socket.io";
import { SocketEvents } from "../../types/base";
import { Game, GameService, Word } from "../../types/game";

export const gameSocketEvents: Record<string, SocketEvents> = {
  start: {
    handler: {
      "game:start": {
        event: "game:start",
        callback: (
          socket: Socket,
          gameService: GameService,
          gameId: string,
          startWord: string
        ) => {
          try {
            gameService.startGame(gameId, startWord);
            const game = gameService.getGame(gameId);
            gameSocketEvents.start.emit["game:started"].callback(socket, game);
          } catch (error) {
            gameSocketEvents.start.emit["game:started:error"].callback(
              socket,
              error
            );
          }
        },
      },
    },
    emit: {
      "game:started": {
        event: "game:started",
        callback: (socket: Socket, game: Game) => {
          const room = `game:${game.id}`;
          socket.nsp
            .to(room)
            .emit(gameSocketEvents.start.emit["game:started"].event, game);
        },
      },
      "game:started:error": {
        event: "game:started:error",
        callback: (socket: Socket, error: Error) => {
          socket.emit(
            gameSocketEvents.start.emit["game:started:error"].event,
            error.message
          );
        },
      },
    },
  },
  word: {
    handler: {
      "game:word": {
        event: "game:word",
        callback: (
          socket: Socket,
          gameService: GameService,
          gameId: string,
          playerId: string,
          word: string
        ) => {
          try {
            const oldGame = gameService.getGame(gameId);
            const game = gameService.emitWord(gameId, word, playerId);
            const isGameFinished = gameService.checkIsGameFinished(gameId);
            if (isGameFinished) {
              gameSocketEvents.game.emit["game:finished"].callback(
                socket,
                game
              );
              return;
            }
            const isRoundFinished =
              oldGame?.rounds.length === game.rounds.length - 1;
            if (isRoundFinished) {
              gameSocketEvents.round.emit["game:round:finished"].callback(
                socket,
                game
              );
              return;
            }
          } catch (error) {
            console.error("Error emitting word:", error);
          }
        },
      },
    },
    emit: {},
  },
  round: {
    handler: {},
    emit: {
      "game:round:finished": {
        event: "game:round:finished",
        callback: (socket: Socket, game: Game) => {
          const room = `game:${game.id}`;
          socket.nsp
            .to(room)
            .emit(
              gameSocketEvents.round.emit["game:round:finished"].event,
              game
            );
        },
      },
    },
  },
  game: {
    handler: {},
    emit: {
      "game:finished": {
        event: "game:finished",
        callback: (socket: Socket, game: Game) => {
          const room = `game:${game.id}`;
          socket.nsp
            .to(room)
            .emit(gameSocketEvents.game.emit["game:finished"].event, game);
        },
      },
    },
  },
  joinRoom: {
    handler: {
      "game:join:room": {
        event: "game:join:room",
        callback: (
          socket: Socket,
          gameService: GameService,
          gameId: string,
          playerId: string
        ) => {
          try {
            console.log(
              "🔥 Player joining room:",
              playerId,
              "to game:",
              gameId
            );
            const room = `game:${gameId}`;
            socket.join(room);
            console.log(
              "✅ Player joined room:",
              room,
              "Socket ID:",
              socket.id
            );

            // Get current game state and send it back to the client who joined
            const game = gameService.getGame(gameId);
            if (!game) {
              throw new Error("Game not found");
            }
            socket.emit("game:room:joined", game);
            console.log(
              "📤 Sent current game state to joined player:",
              game.players.length,
              "players"
            );
          } catch (error) {
            console.error("Error joining room:", error);
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            socket.emit("game:room:join:error", errorMessage);
          }
        },
      },
    },
    emit: {},
  },
};
