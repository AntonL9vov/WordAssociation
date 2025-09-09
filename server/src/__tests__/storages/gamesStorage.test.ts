import { describe, it, expect, beforeEach } from 'vitest';
import { GamesStorage } from '../../storages/gamesStorage';
import { TestDataFactory } from '../testDataFactory';
import { Game } from '../../types/game';

describe('GamesStorage', () => {
  let gamesStorage: GamesStorage;

  beforeEach(() => {
    gamesStorage = new GamesStorage();
  });

  describe('constructor', () => {
    it('should initialize with empty games object by default', async () => {
      const storage = new GamesStorage();
      const games = await storage.getGames();
      expect(games).toEqual([]);
    });

    it('should initialize with provided initial state', async () => {
      const game1 = TestDataFactory.createGame();
      const game2 = TestDataFactory.createGame();
      const initialGames = { [game1.id]: game1, [game2.id]: game2 };
      
      const storage = new GamesStorage(initialGames);
      const games = await storage.getGames();
      
      expect(games).toHaveLength(2);
      expect(games).toContain(game1);
      expect(games).toContain(game2);
    });
  });

  describe('createGame', () => {
    it('should create a game with all required properties', async () => {
      const game = await gamesStorage.createGame();

      expect(game).toMatchObject({
        id: expect.any(String),
        rounds: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        startWord: '',
        status: 'created',
        players: [],
        playersEmittedWords: {},
      });
    });

    it('should generate unique ids for multiple games', async () => {
      const game1 = await gamesStorage.createGame();
      const game2 = await gamesStorage.createGame();

      expect(game1.id).not.toEqual(game2.id);
    });

    it('should add created game to storage', async () => {
      const game = await gamesStorage.createGame();
      
      const foundGame = await gamesStorage.getGame(game.id);
      const allGames = await gamesStorage.getGames();
      expect(foundGame).toEqual(game);
      expect(allGames).toContain(game);
    });

    it('should set createdAt and updatedAt to current time', async () => {
      const beforeCreation = new Date();
      const game = await gamesStorage.createGame();
      const afterCreation = new Date();

      expect(game.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(game.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      expect(game.updatedAt).toEqual(game.createdAt);
    });
  });

  describe('getGame', () => {
    it('should return game by id when exists', async () => {
      const game = await gamesStorage.createGame();
      const foundGame = await gamesStorage.getGame(game.id);

      expect(foundGame).toEqual(game);
    });

    it('should return undefined when game does not exist', async () => {
      const foundGame = await gamesStorage.getGame('non-existent-id');
      expect(foundGame).toBeUndefined();
    });
  });

  describe('getGames', () => {
    it('should return empty array when no games', async () => {
      const games = await gamesStorage.getGames();
      expect(games).toEqual([]);
    });

    it('should return all games', async () => {
      const game1 = await gamesStorage.createGame();
      const game2 = await gamesStorage.createGame();
      const game3 = await gamesStorage.createGame();
      
      const allGames = await gamesStorage.getGames();
      
      expect(allGames).toHaveLength(3);
      expect(allGames).toContain(game1);
      expect(allGames).toContain(game2);
      expect(allGames).toContain(game3);
    });
  });

  describe('updateGame', () => {
    it('should update existing game properties', async () => {
      const game = await gamesStorage.createGame();
      const players = TestDataFactory.createUsers(2);
      const updateData = {
        status: 'started' as const,
        startWord: 'hello',
        players,
      };
      
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
      const updatedGame = await gamesStorage.updateGame(game.id, updateData);
      
      expect(updatedGame).toMatchObject({
        ...game,
        ...updateData,
        updatedAt: expect.any(Date),
      });
      expect(updatedGame.updatedAt.getTime()).toBeGreaterThan(game.updatedAt.getTime());
    });

    it('should preserve id, createdAt, and update updatedAt', async () => {
      const game = await gamesStorage.createGame();
      const originalCreatedAt = game.createdAt;
      
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
      const updatedGame = await gamesStorage.updateGame(game.id, { status: 'started' });
      
      expect(updatedGame.id).toEqual(game.id);
      expect(updatedGame.createdAt).toEqual(originalCreatedAt);
      expect(updatedGame.updatedAt.getTime()).toBeGreaterThan(game.updatedAt.getTime());
    });

    it('should update game in storage', async () => {
      const game = await gamesStorage.createGame();
      const updateData = { startWord: 'test' };
      
      const updatedGame = await gamesStorage.updateGame(game.id, updateData);
      const foundGame = await gamesStorage.getGame(game.id);
      
      expect(foundGame).toEqual(updatedGame);
    });

    it('should handle partial updates', async () => {
      const game = await gamesStorage.createGame();
      const originalStatus = game.status;
      
      const updatedGame = await gamesStorage.updateGame(game.id, { startWord: 'partial' });
      
      expect(updatedGame.startWord).toBe('partial');
      expect(updatedGame.status).toBe(originalStatus);
    });

    it('should handle updating rounds array', async () => {
      const game = await gamesStorage.createGame();
      const newRounds = [TestDataFactory.createRound(), TestDataFactory.createRound()];
      
      const updatedGame = await gamesStorage.updateGame(game.id, { rounds: newRounds });
      
      expect(updatedGame.rounds).toEqual(newRounds);
    });

    it('should handle updating playersEmittedWords', async () => {
      const game = await gamesStorage.createGame();
      const playersEmittedWords = { 'player1': 'word1', 'player2': 'word2' };
      
      const updatedGame = await gamesStorage.updateGame(game.id, { playersEmittedWords });
      
      expect(updatedGame.playersEmittedWords).toEqual(playersEmittedWords);
    });
  });

  describe('deleteGame', () => {
    it('should remove game from storage', async () => {
      const game = await gamesStorage.createGame();
      
      await gamesStorage.deleteGame(game.id);
      
      const foundGame = await gamesStorage.getGame(game.id);
      const allGames = await gamesStorage.getGames();
      expect(foundGame).toBeUndefined();
      expect(allGames).not.toContain(game);
    });

    it('should not affect other games when deleting one', async () => {
      const game1 = await gamesStorage.createGame();
      const game2 = await gamesStorage.createGame();
      const game3 = await gamesStorage.createGame();
      
      await gamesStorage.deleteGame(game2.id);
      
      const remainingGames = await gamesStorage.getGames();
      expect(remainingGames).toHaveLength(2);
      expect(remainingGames).toContain(game1);
      expect(remainingGames).toContain(game3);
      expect(remainingGames).not.toContain(game2);
    });

    it('should handle deletion of non-existent game gracefully', async () => {
      const game = await gamesStorage.createGame();
      const initialGames = await gamesStorage.getGames();
      
      await gamesStorage.deleteGame('non-existent-id');
      
      const finalGames = await gamesStorage.getGames();
      expect(finalGames).toEqual(initialGames);
    });
  });
});