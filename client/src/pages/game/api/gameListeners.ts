import { Game } from "@/shared/lib/types";
import { SocketService } from "@/shared/api/socket";

export const onRoomPlayersChanged = (
  setGame: (game: Game) => void,
  socket: SocketService
) => {
  const callback = (game: Game) => {
    setGame(game);
  };

  socket.on("game:players:update", callback);

  return () => {
    socket.off("game:players:update", callback);
  };
};

export const onGameStarted = (
  setGame: (game: Game) => void,
  socket: SocketService
) => {
  const callback = (game: Game) => {
    setGame(game);
  };

  socket.on("game:start", callback);

  return () => {
    socket.off("game:start", callback);
  };
};

export const onGameFinished = (
  setGame: (game: Game) => void,
  socket: SocketService
) => {
  const callback = (game: Game) => {
    setGame(game);
  };

  socket.on("game:finished", callback);

  return () => {
    socket.off("game:finished", callback);
  };
};
