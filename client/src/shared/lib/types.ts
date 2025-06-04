// Common types used throughout the application

export interface User {
  id: string;
  username: string;
  avatar?: string;
}

export interface GameState {
  id: string;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  currentTurn?: string; // player id
  startedAt?: Date;
  endedAt?: Date;
}

export interface Player {
  id: string;
  userId: string;
  username: string;
  score: number;
  isReady: boolean;
  isOnline: boolean;
}

export type GameAction = {
  type: string;
  payload: any;
  playerId: string;
  timestamp: number;
};
