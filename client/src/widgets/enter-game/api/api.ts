import { api } from "@/shared/api/api";

export const createGame = async (id: string) => {
  const response = await api.post("/games", { playerId: id });
  return response;
};

export const joinGame = async (gameId: string, id: string) => {
  const response = await api.post(`/games/${gameId}`, { playerId: id });
  return response;
};
