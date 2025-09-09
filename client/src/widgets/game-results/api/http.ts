import { api } from "@/shared";
import { Game } from "@/shared";

export const disconnectPlayer = async (
  gameId: string,
  playerId: string,
  setGame: (game: Game) => void
) => {
  const response = await api.post<Game>(`/games/${gameId}/disconnect`, {
    playerId,
  });
  setGame(response);
  return response;
};
