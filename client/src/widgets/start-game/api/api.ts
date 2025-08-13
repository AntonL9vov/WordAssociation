import { api } from "@/shared/api/api";
import { Game } from "@/shared/lib/types";
import { gameSchema } from "@/shared/schemas/game";

export const getRandomWord = async (): Promise<string> => {
  const res = await api.get<{ word: string }>("/games/get-random-word");
  return res.word;
};

export const startGame = async (
  gameId: string,
  startWord: string
): Promise<Game> => {
  return api.post(`/games/${gameId}/start`, { startWord }, gameSchema);
};
