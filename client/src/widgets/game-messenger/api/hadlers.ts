import { SocketService } from "@/shared/api/socket";

export const sendMessage = (
  message: string,
  gameId: string,
  playerId: string,
  socket: SocketService
) => {
  if (socket.connected) {
    socket.emit("game:word", gameId, playerId, message);
  } else {
    console.warn('⚠️ Socket not connected, unable to send message');
  }
};
