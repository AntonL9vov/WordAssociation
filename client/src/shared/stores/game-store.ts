import { create } from "zustand";
import { Game } from "../lib/types";

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  setGame: (game) => set({ game }),
}));

interface GameStore {
  game: Game | null;
  setGame: (game: Game) => void;
}