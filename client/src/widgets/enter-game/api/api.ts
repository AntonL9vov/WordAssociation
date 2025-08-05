import { api } from "@/shared/api/api";
import { Game } from "@/shared/lib/types";

export const createGame = async (id: string) => {
  const response = await api.post<Game>("/games", { playerId: id });
  return response;
};

export const joinGame = async (gameId: string, id: string) => {
  const response = await api.post<Game>(`/games/${gameId}`, { playerId: id });
  return response;
};
