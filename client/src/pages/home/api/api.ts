import { api } from "@/shared/api/api";
import { Game } from "@/shared/lib/types";

export const isPlayerInGame = async (playerId: string) => {
  const response = await api.post<Game | null>(`/games/is-player-in-game`, { playerId });
  return response;
};