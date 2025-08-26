import { create } from "zustand";
import { Game } from "../lib/types";

  export const useGameStore = create<GameStore>((set) => ({
    game: null,
    setGame: (game) => set({ game }),
    clearGame: () => set({ game: null }),
  }));

  interface GameStore {
    game: Game | null;
    setGame: (game: Game) => void;
    clearGame: () => void;
  }