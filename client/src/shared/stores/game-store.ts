import { create } from "zustand";
import { Game } from "../lib/types";

  export const useGameStore = create<GameStore>((set) => ({
    game: null,
    setGame: (game) => set({ game }),
    clearGame: () => set({ game: null }),
    setPlayersEmittedWords: (playersEmittedWords) => set((state) => {
      if (!state.game) {
        return { game: null };
      }
      return { game: {
        ...state.game,
        playersEmittedWords,
      }};
    }),
  }));

  interface GameStore {
    game: Game | null;
    setGame: (game: Game) => void;
    clearGame: () => void;
    setPlayersEmittedWords: (playersEmittedWords: { [playerId: string]: string }) => void;
  }