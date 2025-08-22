import { api } from "@/shared/api/api";
import { Game } from "@/shared/lib/types";

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
