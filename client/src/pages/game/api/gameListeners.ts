import { Game } from "@/shared/lib/types";
import { SocketService } from "@/shared/api/socket";

enum GAME_EVENTS {
  PLAYERS_UPDATE = "game:players:updated",
  GAME_START = "game:started",
  GAME_FINISHED = "game:finished",
  GAME_RESTART = "game:restart",
}

export const initGameListeners = (
  setGame: (game: Game) => void,
  socket: SocketService
) => {
  const callback = (game: Game) => {
    try {
      setGame(game);
    } catch (error) {
      console.error("Error setting game:", error);
    }
  };

  Object.values(GAME_EVENTS).forEach((event) => {
    if (socket.connected) {
      socket.on(event, callback);
    }
  });

  return () => {
    Object.values(GAME_EVENTS).forEach((event) => {
      socket.off(event, callback);
    });
  };
};

export const onGameWordEmitted = (
  setPlayersEmittedWords: (playersEmittedWords: Record<string, string>) => void,
  socket: SocketService
) => {
  const callback = (playersEmittedWords: Record<string, string>) => {
    setPlayersEmittedWords(playersEmittedWords);
  };

  if (socket.connected) {
    socket.on("game:word", callback);
  }

  return () => {
    socket.off("game:word", callback);
  };
};
