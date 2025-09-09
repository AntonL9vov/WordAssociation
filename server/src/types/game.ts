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
  status: GameStatus;
  players: User[];
  playersEmittedWords: {
    [playerId: string]: string;
  };
}

export type GameStatus = "created" | "started" | "finished";

export interface GamesStorage {
  getGame(gameId: string): Promise<Game | undefined>;
  getGames(): Promise<Game[]>;
  createGame(): Promise<Game>;
  deleteGame(gameId: string): Promise<void>;
  updateGame(
    gameId: string,
    game: Partial<Omit<Game, "id" | "createdAt" | "updatedAt">>
  ): Promise<Game>;
}

export interface EmitWordReturn {
  game: Game;
  playersEmittedWords: {
    [playerId: string]: string;
  };
}

export interface GameService {
  getGame(gameId: string): Promise<Game | undefined>;
  createGame(playerId: string): Promise<Game>;
  deleteGame(gameId: string): Promise<void>;
  emitWord(gameId: string, word: string, playerId: string): Promise<EmitWordReturn>;
  addPlayerToGame(gameId: string, playerId: string): Promise<Game>;
  checkIsRoundFinished(gameId: string): Promise<boolean>;
  checkIsGameFinished(gameId: string): Promise<boolean>;
  finishGame(gameId: string): Promise<void>;
  checkLastRound(gameId: string): Promise<boolean>;
  addRound(gameId: string): Promise<void>;
  startGame(gameId: string, startWord: string): Promise<Game>;
  restartGame(gameId: string): Promise<Game>;
  deletePlayerFromGame(gameId: string, playerId: string): Promise<Game>;
}

export interface GameHandler extends Omit<Handler, "handler"> {
  handler: (gameService: GameService, socket: Socket, ...args: any[]) => void;
}

export interface GameServiceEmitters {
  gameFinished(game: Game): void;
  newRoundStarted(game: Game): void;
}
