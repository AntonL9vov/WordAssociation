import { Socket } from "socket.io";
import { User, UsersService } from "./users";
import { Handler } from "./base";

export interface Word {
  id: string;
  word: string;
  playerId: string;
  playerName: string;
  timestamp: Date;
}

export interface Round {
  id: string;
  words: Word[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  rounds: Round[];
  createdAt: Date;
  updatedAt: Date;
  startWord: string;
  isFinished: boolean; //TODO: remake to new Type where if isStarted is false isFinished can never be true
  isStarted: boolean;
  players: User[];
}

export interface GamesStorage {
  getGame(gameId: string): Game | undefined;
  createGame(): Game;
  deleteGame(gameId: string): void;
  updateGame(
    gameId: string,
    game: Partial<Omit<Game, "id" | "createdAt" | "updatedAt">>
  ): Game;
}

export interface GameService {
  getGame(gameId: string): Game | undefined;
  createGame(playerId: string): Game;
  deleteGame(gameId: string): void;
  emitWord(gameId: string, word: string, playerId: string): Word;
  addPlayerToGame(gameId: string, playerId: string): Game;
  checkIsRoundFinished(gameId: string): boolean;
  checkIsGameFinished(gameId: string): boolean;
  finishGame(gameId: string): void;
  checkLastRound(gameId: string): boolean;
  addRound(gameId: string): void;
  startGame(gameId: string, startWord: string): void;
}

export interface GameHandler extends Omit<Handler, "handler"> {
  handler: (gameService: GameService, socket: Socket, ...args: any[]) => void;
}

export interface GameServiceEmitters {
  gameFinished(game: Game): void;
  newRoundStarted(game: Game): void;
}
