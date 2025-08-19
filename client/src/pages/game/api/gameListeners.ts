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
  console.log("🎧 Set up listener for: game:players:update");

  return () => {
    socket.off("game:players:update", callback);
  };
};
