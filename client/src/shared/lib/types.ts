export interface User {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  players: User[];
  currentRound: number;
  startWord: string | null;
  createdAt: Date;
  updatedAt: Date;
  isStarted: boolean;
  isFinished: boolean;
  rounds: Round[];
}

export interface Round {
  id: string;
  words: Word[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Word {
  id: string;
  word: string;
  playerId: string;
  playerName: string;
  timestamp: Date;
}

export interface GameEvent {
  type: GameEventType;
  data: any;
  gameId: string;
}

export enum GameEventType {
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
  WORD_SUBMITTED = "WORD_SUBMITTED",
  ROUND_STARTED = "ROUND_STARTED",
  GAME_ENDED = "GAME_ENDED",
}

export interface GameStats {
  gameId: string;
  winner: User | null;
  rounds: number;
  initialWords: string[];
  finalWord: string;
  duration: number;
}
