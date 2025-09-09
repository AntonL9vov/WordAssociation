import { User } from './user.model';

/**
 * @example {
 *   "id": "word-123",
 *   "word": "hello",
 *   "playerId": "user-123", 
 *   "playerName": "John Doe",
 *   "timestamp": "2023-01-01T00:00:00Z"
 * }
 */
export interface Word {
  /** @example "word-123" */
  id: string;
  /** @example "hello" */
  word: string;
  /** @example "user-123" */
  playerId: string;
  /** @example "John Doe" */
  playerName: string;
  /** @example "2023-01-01T00:00:00Z" */
  timestamp: Date;
}

/**
 * @example {
 *   "id": "round-123",
 *   "words": [
 *     {"id": "word-123", "word": "hello", "playerId": "user-123", "playerName": "John Doe", "timestamp": "2023-01-01T00:00:00Z"}
 *   ],
 *   "createdAt": "2023-01-01T00:00:00Z",
 *   "updatedAt": "2023-01-01T00:00:00Z"
 * }
 */
export interface Round {
  /** @example "round-123" */
  id: string;
  words: Word[];
  /** @example "2023-01-01T00:00:00Z" */
  createdAt: Date;
  /** @example "2023-01-01T00:00:00Z" */
  updatedAt: Date;
}

/**
 * @example {
 *   "id": "game-123",
 *   "rounds": [],
 *   "createdAt": "2023-01-01T00:00:00Z",
 *   "updatedAt": "2023-01-01T00:00:00Z",
 *   "startWord": "hello",
 *   "isFinished": false,
 *   "isStarted": true,
 *   "players": [
 *     {"id": "user-123", "name": "John Doe"}
 *   ]
 * }
 */
export interface Game {
  /** @example "game-123" */
  id: string;
  rounds: Round[];
  /** @example "2023-01-01T00:00:00Z" */
  createdAt: Date;
  /** @example "2023-01-01T00:00:00Z" */
  updatedAt: Date;
  /** @example "hello" */
  startWord: string;
  /** @example false */
  isFinished: boolean;
  /** @example true */
  isStarted: boolean;
  players: User[];
}

/**
 * @example {
 *   "playerId": "user-123"
 * }
 */
export interface CreateGameRequest {
  /** @example "user-123" */
  playerId: string;
}

/**
 * @example {
 *   "playerId": "user-123"
 * }
 */
export interface JoinGameRequest {
  /** @example "user-123" */
  playerId: string;
}

/**
 * @example {
 *   "playerId": "user-123"
 * }
 */
export interface IsPlayerInGameRequest {
  /** @example "user-123" */
  playerId: string;
}

/**
 * @example {
 *   "game": {
 *     "id": "game-123",
 *     "rounds": [],
 *     "createdAt": "2023-01-01T00:00:00Z",
 *     "updatedAt": "2023-01-01T00:00:00Z",
 *     "startWord": "hello",
 *     "isFinished": false,
 *     "isStarted": true,
 *     "players": [{"id": "user-123", "name": "John Doe"}]
 *   }
 * }
 */
export interface GameResponse {
  game: Game;
}