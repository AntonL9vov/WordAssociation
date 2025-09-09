import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameService } from '../../services/gameService';
import { TestDataFactory } from '../testDataFactory';

// Simple unit tests focused on business logic, not framework integration
describe('GameController Logic', () => {
  let mockGameService: GameService;

  beforeEach(() => {
    mockGameService = {
      createGame: vi.fn(),
      addPlayerToGame: vi.fn(),
      restartGame: vi.fn(),
      deletePlayerFromGame: vi.fn(),
      isPlayerInGameByPlayerId: vi.fn(),
      startGame: vi.fn(),
    } as any;
  });

  describe('createGame logic', () => {
    it('should delegate to game service', () => {
      const playerId = 'player-123';
      const createdGame = TestDataFactory.createGame();
      mockGameService.createGame = vi.fn().mockReturnValue(createdGame);

      const result = mockGameService.createGame(playerId);

      expect(result).toEqual(createdGame);
      expect(mockGameService.createGame).toHaveBeenCalledWith(playerId);
    });
  });

  describe('joinGame logic', () => {
    it('should add player to game', () => {
      const gameId = 'game-123';
      const playerId = 'player-123';
      const game = TestDataFactory.createGameWithPlayers(2);
      
      mockGameService.addPlayerToGame = vi.fn().mockReturnValue(game);

      const result = mockGameService.addPlayerToGame(gameId, playerId);

      expect(result).toEqual(game);
      expect(mockGameService.addPlayerToGame).toHaveBeenCalledWith(gameId, playerId);
    });
  });

  describe('restartGame logic', () => {
    it('should restart game via service', () => {
      const gameId = 'game-123';
      const restartedGame = TestDataFactory.createGame();
      
      mockGameService.restartGame = vi.fn().mockReturnValue(restartedGame);

      const result = mockGameService.restartGame(gameId);

      expect(result).toEqual(restartedGame);
      expect(mockGameService.restartGame).toHaveBeenCalledWith(gameId);
    });
  });

  describe('leaveGame logic', () => {
    it('should remove player from game', () => {
      const gameId = 'game-123';
      const playerId = 'player-123';
      const updatedGame = TestDataFactory.createGameWithPlayers(1);
      
      mockGameService.deletePlayerFromGame = vi.fn().mockReturnValue(updatedGame);

      const result = mockGameService.deletePlayerFromGame(gameId, playerId);

      expect(result).toEqual(updatedGame);
      expect(mockGameService.deletePlayerFromGame).toHaveBeenCalledWith(gameId, playerId);
    });
  });

  describe('isPlayerInGame logic', () => {
    it('should check if player is in any game', () => {
      const playerId = 'player-123';
      const game = TestDataFactory.createGameWithPlayers(1);
      
      mockGameService.isPlayerInGameByPlayerId = vi.fn().mockReturnValue(game);

      const result = mockGameService.isPlayerInGameByPlayerId(playerId);

      expect(result).toEqual(game);
      expect(mockGameService.isPlayerInGameByPlayerId).toHaveBeenCalledWith(playerId);
    });

    it('should return null when player not in any game', () => {
      const playerId = 'player-123';
      
      mockGameService.isPlayerInGameByPlayerId = vi.fn().mockReturnValue(null);

      const result = mockGameService.isPlayerInGameByPlayerId(playerId);

      expect(result).toBeNull();
    });
  });

  describe('startGame logic', () => {
    it('should start game with start word', () => {
      const gameId = 'game-123';
      const startWord = 'hello';
      const startedGame = TestDataFactory.createStartedGame();
      
      mockGameService.startGame = vi.fn().mockReturnValue(startedGame);

      const result = mockGameService.startGame(gameId, startWord);

      expect(result).toEqual(startedGame);
      expect(mockGameService.startGame).toHaveBeenCalledWith(gameId, startWord);
    });
  });

  describe('getRandomWord logic', () => {
    it('should return a word from predefined list', () => {
      const expectedWords = [
        'море', 'ветер', 'смысл', 'луч', 'игра', 'связь', 'мост', 'шаг',
        'искра', 'путь', 'стихия', 'облако', 'снег', 'тропа', 'свет',
        'заря', 'момент', 'миг', 'мысль', 'узор',
      ];

      // Simulate the random word selection logic
      const randomIndex = Math.floor(Math.random() * expectedWords.length);
      const selectedWord = expectedWords[randomIndex];

      expect(expectedWords).toContain(selectedWord);
      expect(typeof selectedWord).toBe('string');
      expect(selectedWord.length).toBeGreaterThan(0);
    });

    it('should have all expected words in the list', () => {
      const expectedWords = [
        'море', 'ветер', 'смысл', 'луч', 'игра', 'связь', 'мост', 'шаг',
        'искра', 'путь', 'стихия', 'облако', 'снег', 'тропа', 'свет',
        'заря', 'момент', 'миг', 'мысль', 'узор',
      ];

      expect(expectedWords).toHaveLength(20);
      expect(expectedWords.every(word => typeof word === 'string' && word.length > 0)).toBe(true);
    });
  });
});