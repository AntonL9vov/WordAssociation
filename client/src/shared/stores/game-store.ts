import { create } from "zustand";
import { Game } from "../lib/types";
import { immer } from "zustand/middleware/immer";

interface GameStore {
  game: Game | null;
  setGame: (game: Game) => void;
  clearGame: () => void;
  setPlayersEmittedWords: (playersEmittedWords: Record<string, string>) => void;
}

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    game: null,
    setGame: (game) =>
      set((state) => {
        state.game = game;
      }),
    clearGame: () =>
      set((state) => {
        state.game = null;
      }),
    setPlayersEmittedWords: (playersEmittedWords) =>
      set((state) => {
        if (!state.game) return;
        state.game.playersEmittedWords = playersEmittedWords;
      }),
  }))
);
