import { Game } from "@/shared/lib/types";
import { SocketService } from "@/shared/api/socket";

const GAME_EVENTS = {
  PLAYERS_UPDATE: "game:players:updated", // Updated event name
  GAME_START: "game:started", // Updated event name
  GAME_FINISHED: "game:finished",
  GAME_RESTART: "game:restart",
};

export const initGameListeners = (
  setGame: (game: Game) => void,
  socket: SocketService
) => {
  const callback = (game: Game) => {
    setGame(game);
  };

  Object.values(GAME_EVENTS).forEach((event) => {
    socket.on(event, callback);
  });

  return () => {
    Object.values(GAME_EVENTS).forEach((event) => {
      socket.off(event, callback);
    });
  };
};

export const onGameWordEmitted = (
  setPlayersEmittedWords: (playersEmittedWords: { [playerId: string]: string }) => void,
  socket: SocketService
) => {
  const callback = (playersEmittedWords: { [playerId: string]: string }) => {
    setPlayersEmittedWords(playersEmittedWords);
  };

  socket.on("game:word", callback);

  return () => {
    socket.off("game:word", callback);
  };
};
