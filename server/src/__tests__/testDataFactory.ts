import { User } from '../types/users';
import { Game, GameStatus, Round, Word } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

export class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return {
      id: uuidv4(),
      name: 'Test User',
      ...overrides,
    };
  }

  static createUsers(count: number): User[] {
    return Array.from({ length: count }, (_, i) => 
      this.createUser({ name: `Test User ${i + 1}` })
    );
  }

  static createGame(overrides: Partial<Game> = {}): Game {
    return {
      id: uuidv4(),
      rounds: [],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
      startWord: '',
      status: 'created' as GameStatus,
      players: [],
      playersEmittedWords: {},
      ...overrides,
    };
  }

  static createWord(overrides: Partial<Word> = {}): Word {
    const user = this.createUser();
    return {
      id: uuidv4(),
      word: 'test',
      playerId: user.id,
      playerName: user.name,
      timestamp: new Date('2023-01-01T00:00:00Z'),
      ...overrides,
    };
  }

  static createRound(overrides: Partial<Round> = {}): Round {
    return {
      id: uuidv4(),
      words: [],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
      ...overrides,
    };
  }

  static createGameWithPlayers(playerCount: number, gameOverrides: Partial<Game> = {}): Game {
    const players = this.createUsers(playerCount);
    return this.createGame({
      players,
      ...gameOverrides,
    });
  }

  static createStartedGame(playerCount: number = 2): Game {
    const game = this.createGameWithPlayers(playerCount);
    return {
      ...game,
      status: 'started' as GameStatus,
      startWord: 'hello',
      rounds: [this.createRound()],
    };
  }
}