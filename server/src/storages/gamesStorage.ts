import type { GamesStorage as IGameStorage } from "../types/game";
import { Game } from "../types/game";
import { v4 as uuidv4 } from "uuid";

export class GamesStorage implements IGameStorage {
  private games: Record<string, Game>;

  constructor(initialState: Record<string, Game> = {}) {
    this.games = initialState;
  }

  getGame(gameId: string): Game | undefined {
    return this.games[gameId];
  }

  createGame(): Game {
    const game: Game = {
      id: uuidv4(),
      rounds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      startWord: "",
      status: "created",
      players: [],
      playersEmittedWords: {},
    };

    this.games[game.id] = game;
    return game;
  }

  deleteGame(gameId: string): void {
    delete this.games[gameId];
  }

  getGames(): Game[] {
    return Object.values(this.games);
  }

  updateGame(
    gameId: string,
    game: Partial<Omit<Game, "id" | "createdAt" | "updatedAt">>
  ): Game {
    this.games[gameId] = {
      ...this.games[gameId],
      ...game,
      updatedAt: new Date(),
    };

    return this.games[gameId];
  }
}
