import { SocketService } from "@/shared/api/socket";
import { Game } from "@/shared/lib/types";

export const onGameRoundFinished = (
  setGame: (game: Game) => void,
  socket: SocketService
) => {
  const callback = (game: Game) => {
    setGame(game);
  };
  socket.on("game:round:finished", callback);

  return () => {
    socket.off("game:round:finished", callback);
  };
};