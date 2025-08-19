import { SocketService } from "@/shared/api/socket";

export const sendMessage = (
  message: string,
  gameId: string,
  playerId: string,
  socket: SocketService
) => {
  socket.emit("game:word", gameId, playerId, message);
};
