import { Socket } from "socket.io";
import { SocketEvents } from "../../types/base";
import { Game, GameService, Word } from "../../types/game";

export const gameSocketEvents: Record<string, SocketEvents> = {
  start: {
    handler: {
      "game:start": {
        event: "game:start",
        callback: async (
          socket: Socket,
          gameService: GameService,
          gameId: string,
          startWord: string
        ) => {
          try {
            await gameService.startGame(gameId, startWord);
            const game = await gameService.getGame(gameId);
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
        callback: async (
          socket: Socket,
          gameService: GameService,
          gameId: string,
          playerId: string,
          word: string
        ) => {
          try {
            const oldGame = await gameService.getGame(gameId);
            const { game, playersEmittedWords } = await gameService.emitWord(gameId, word, playerId);
            const isGameFinished = await gameService.checkIsGameFinished(gameId);
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
            gameSocketEvents.word.emit["game:word"].callback(socket, gameId, playersEmittedWords);
          } catch (error) {
            console.error("Error emitting word:", error);
          }
        },
      },
    },
    emit: {
      "game:word": {
        event: "game:word",
        callback: (socket: Socket, gameId: string, playersEmittedWords: { [playerId: string]: string }) => {
          const room = `game:${gameId}`;
          console.log("🔥 Players emitted words:", playersEmittedWords);
          socket.nsp.to(room).emit(gameSocketEvents.word.emit["game:word"].event, playersEmittedWords);
        },
      },
    },
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
        callback: async (
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
            const game = await gameService.getGame(gameId);
            if (!game) {
              throw new Error("Game not found");
            }
            socket.emit("game:room:joined", game);
            console.log(
              "📤 Sent current game state to joined player:",
              game.players.length,
              "players"
            );
            
            // Notify all other players in the room about the updated game state
            socket.to(room).emit("game:players:updated", game);
            console.log(
              "📤 Broadcasted game update to room:",
              room,
              "with",
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
    emit: {
      "game:players:updated": {
        event: "game:players:updated",
        callback: (socket: Socket, game: Game) => {
          const room = `game:${game.id}`;
          socket.nsp
            .to(room)
            .emit(gameSocketEvents.joinRoom.emit["game:players:updated"].event, game);
        },
      },
    },
  },
};
