import { api } from "@/shared/api/api";
import { Game } from "@/shared/lib/types";
import { gameSchema } from "@/shared/schemas/game";

export const createGame = async (id: string): Promise<Game> => {
  const response = await api.post("/games", { playerId: id }, gameSchema);
  return response;
};

export const joinGame = async (gameId: string, id: string): Promise<Game> => {
  const response = await api.post(`/games/${gameId}/join`, { playerId: id }, gameSchema);
  return response;
};
