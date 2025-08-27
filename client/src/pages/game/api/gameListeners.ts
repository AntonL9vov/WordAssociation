import { Game } from "@/shared/lib/types";
import { SocketService } from "@/shared/api/socket";

const GAME_EVENTS = {
  PLAYERS_UPDATE: "game:players:update",
  GAME_START: "game:start",
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

// export const onRoomPlayersChanged = (
//   setGame: (game: Game) => void,
//   socket: SocketService
// ) => {
//   const callback = (game: Game) => {
//     setGame(game);
//   };

//   socket.on("game:players:update", callback);

//   return () => {
//     socket.off("game:players:update", callback);
//   };
// };

// export const onGameStarted = (
//   setGame: (game: Game) => void,
//   socket: SocketService
// ) => {
//   const callback = (game: Game) => {
//     setGame(game);
//   };

//   socket.on("game:start", callback);

//   return () => {
//     socket.off("game:start", callback);
//   };
// };

// export const onGameFinished = (
//   setGame: (game: Game) => void,
//   socket: SocketService
// ) => {
//   const callback = (game: Game) => {
//     setGame(game);
//   };

//   socket.on("game:finished", callback);

//   return () => {
//     socket.off("game:finished", callback);
//   };
// };

// export const onGameLeft = (
//   setGame: (game: Game) => void,
//   socket: SocketService
// ) => {
//   const callback = (game: Game) => {
//     setGame(game);
//   };

//   socket.on("game:left", callback);

//   return () => {
//     socket.off("game:left", callback);
//   };
// };
