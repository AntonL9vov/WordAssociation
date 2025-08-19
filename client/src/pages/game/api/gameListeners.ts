import { Game } from "@/shared/lib/types";
import { SocketService } from "@/shared/api/socket";

export const onRoomJoined = (
  setGame: (game: Game) => void,
  socket: SocketService
) => {
  const callback = (game: Game) => {
    console.log(
      "✅ Successfully joined room with game state:",
      game.players.length,
      "players"
    );
    setGame(game);
  };

  socket.on("game:player:joined", callback);
  console.log("🎧 Set up listener for: game:player:joined");

  return () => {
    socket.off("game:player:joined", callback);
  };
};
