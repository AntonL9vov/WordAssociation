import { api, Game } from "@/shared";

export const leaveGame = async (gameId: string, playerId: string) => {
  const response = await api.post<Game>(`/games/${gameId}/leave`, { playerId });
  return response;
};

export const restartGame = async (gameId: string) => {
  const response = await api.get<Game>(`/games/${gameId}/restart`);
  return response;
};  