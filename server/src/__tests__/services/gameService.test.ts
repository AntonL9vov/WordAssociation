import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameService } from '../../services/gameService';
import { UsersService } from '../../services/usersService';
import { GamesStorage } from '../../storages/gamesStorage';
import { TestDataFactory } from '../testDataFactory';
import { Game, GameStatus } from '../../types/game';
import { User } from '../../types/users';

describe('GameService', () => {
  let gameService: GameService;
  let mockGamesStorage: GamesStorage;
  let mockUsersService: UsersService;

  beforeEach(() => {
    mockGamesStorage = new GamesStorage();
    mockUsersService = {} as UsersService;
    gameService = new GameService(mockGamesStorage, mockUsersService);
  });

  describe('getGame', () => {
    it('should return game when it exists', async () => {
      const game = TestDataFactory.createGame();
      vi.spyOn(mockGamesStorage, 'getGame').mockResolvedValue(game);

      const result = await gameService.getGame(game.id);

      expect(result).toEqual(game);
      expect(mockGamesStorage.getGame).toHaveBeenCalledWith(game.id);
    });

    it('should throw error when game does not exist', async () => {
      vi.spyOn(mockGamesStorage, 'getGame').mockResolvedValue(undefined);

      await expect(gameService.getGame('non-existent-id')).rejects.toThrow('Game non-existent-id not found');
    });
  });

  describe('getGames', () => {
    it('should return all games from storage', async () => {
      const games = [TestDataFactory.createGame(), TestDataFactory.createGame()];
      vi.spyOn(mockGamesStorage, 'getGames').mockResolvedValue(games);

      const result = await gameService.getGames();

      expect(result).toEqual(games);
      expect(mockGamesStorage.getGames).toHaveBeenCalled();
    });
  });

  describe('getPlayer', () => {
    it('should return player when it exists', async () => {
      const player = TestDataFactory.createUser();
      mockUsersService.getUser = vi.fn().mockResolvedValue(player);

      const result = await gameService.getPlayer(player.id);

      expect(result).toEqual(player);
      expect(mockUsersService.getUser).toHaveBeenCalledWith(player.id);
    });

    it('should throw error when player does not exist', async () => {
      mockUsersService.getUser = vi.fn().mockResolvedValue(undefined);
      const playerId = 'non-existent';

      await expect(gameService.getPlayer(playerId)).rejects.toThrow(`Player ${playerId} not found`);
    });
  });

  describe('isPlayerInGame', () => {
    it('should return game when player is in game', async () => {
      const player = TestDataFactory.createUser();
      const game = TestDataFactory.createGameWithPlayers(1);
      game.players = [player];
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      const result = await gameService.isPlayerInGame(game.id, player.id);

      expect(result).toEqual(game);
    });

    it('should return null when player is not in game', async () => {
      const game = TestDataFactory.createGameWithPlayers(1);
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      const result = await gameService.isPlayerInGame(game.id, 'different-player');

      expect(result).toBeNull();
    });
  });

  describe('isPlayerInGameByPlayerId', () => {
    it('should return game when player is found in any game', async () => {
      const player = TestDataFactory.createUser();
      const game1 = TestDataFactory.createGame();
      const game2 = TestDataFactory.createGameWithPlayers(1);
      game2.players = [player];
      
      vi.spyOn(mockGamesStorage, 'getGames').mockResolvedValue([game1, game2]);

      const result = await gameService.isPlayerInGameByPlayerId(player.id);

      expect(result).toEqual(game2);
    });

    it('should return null when player is not found in any game', async () => {
      const games = [TestDataFactory.createGame(), TestDataFactory.createGame()];
      vi.spyOn(mockGamesStorage, 'getGames').mockResolvedValue(games);

      const result = await gameService.isPlayerInGameByPlayerId('non-existent-player');

      expect(result).toBeNull();
    });
  });

  describe('createGame', () => {
    it('should create game and add player', async () => {
      const playerId = 'player-1';
      const createdGame = TestDataFactory.createGame();
      const gameWithPlayer = { ...createdGame, players: [TestDataFactory.createUser()] };
      
      vi.spyOn(mockGamesStorage, 'createGame').mockResolvedValue(createdGame);
      vi.spyOn(gameService, 'addPlayerToGame').mockResolvedValue(gameWithPlayer);
      vi.spyOn(mockGamesStorage, 'getGame').mockResolvedValue(gameWithPlayer);

      const result = await gameService.createGame(playerId);

      expect(mockGamesStorage.createGame).toHaveBeenCalled();
      expect(gameService.addPlayerToGame).toHaveBeenCalledWith(createdGame.id, playerId);
      expect(result).toEqual(gameWithPlayer);
    });
  });

  describe('addPlayerToGame', () => {
    it('should add player to game when game is in created status', async () => {
      const game = TestDataFactory.createGame({ status: 'created' });
      const player = TestDataFactory.createUser();
      const updatedGame = { ...game, players: [player] };
      
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);
      vi.spyOn(gameService, 'getPlayer').mockResolvedValue(player);
      vi.spyOn(gameService, 'isPlayerInGame').mockResolvedValue(null);
      vi.spyOn(mockGamesStorage, 'updateGame').mockResolvedValue(updatedGame);

      const result = await gameService.addPlayerToGame(game.id, player.id);

      expect(result).toEqual(updatedGame);
      expect(mockGamesStorage.updateGame).toHaveBeenCalledWith(game.id, {
        players: [player],
      });
    });

    it('should throw error when game is already started', async () => {
      const game = TestDataFactory.createGame({ status: 'started' });
      const player = TestDataFactory.createUser();
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);
      vi.spyOn(gameService, 'getPlayer').mockResolvedValue(player);

      await expect(gameService.addPlayerToGame(game.id, player.id))
        .rejects.toThrow(`Game ${game.id} is already started`);
    });

    it('should throw error when game is finished', async () => {
      const game = TestDataFactory.createGame({ status: 'finished' });
      const player = TestDataFactory.createUser();
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);
      vi.spyOn(gameService, 'getPlayer').mockResolvedValue(player);

      await expect(gameService.addPlayerToGame(game.id, player.id))
        .rejects.toThrow(`Game ${game.id} is finished`);
    });

    it('should throw error when player is already in game', async () => {
      const player = TestDataFactory.createUser();
      const game = TestDataFactory.createGame({ status: 'created', players: [player] });
      
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);
      vi.spyOn(gameService, 'getPlayer').mockResolvedValue(player);
      vi.spyOn(gameService, 'isPlayerInGame').mockResolvedValue(game);

      await expect(gameService.addPlayerToGame(game.id, player.id))
        .rejects.toThrow(`Player ${player.id} already in game ${game.id}`);
    });
  });

  describe('startGame', () => {
    it('should start game with 2 or more players', async () => {
      const game = TestDataFactory.createGameWithPlayers(2, { status: 'created' });
      const startWord = 'hello';
      const startedGame = { ...game, status: 'started' as GameStatus, startWord };
      
      vi.spyOn(gameService, 'getGame').mockResolvedValueOnce(game).mockResolvedValueOnce(startedGame);
      vi.spyOn(mockGamesStorage, 'updateGame').mockResolvedValue(startedGame);
      vi.spyOn(gameService, 'addRound').mockResolvedValue(undefined);

      const result = await gameService.startGame(game.id, startWord);

      expect(mockGamesStorage.updateGame).toHaveBeenCalledWith(game.id, {
        status: 'started',
        startWord,
      });
      expect(gameService.addRound).toHaveBeenCalledWith(game.id);
      expect(result).toEqual(startedGame);
    });

    it('should throw error when game has less than 2 players', async () => {
      const game = TestDataFactory.createGameWithPlayers(1);
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      await expect(gameService.startGame(game.id, 'hello'))
        .rejects.toThrow(`Game ${game.id} has less than 2 players`);
    });

    it('should throw error when game is already started', async () => {
      const game = TestDataFactory.createGameWithPlayers(2, { status: 'started' });
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      await expect(gameService.startGame(game.id, 'hello'))
        .rejects.toThrow(`Game ${game.id} is already started`);
    });
  });

  describe('getLastRound', () => {
    it('should return last round when rounds exist', async () => {
      const rounds = [TestDataFactory.createRound(), TestDataFactory.createRound()];
      const game = TestDataFactory.createGame({ rounds });
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      const result = await gameService.getLastRound(game.id);

      expect(result).toEqual(rounds[1]);
    });

    it('should throw error when no rounds exist', async () => {
      const game = TestDataFactory.createGame({ rounds: [] });
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      await expect(gameService.getLastRound(game.id))
        .rejects.toThrow(`Game ${game.id} has no rounds`);
    });
  });

  describe('emitWord', () => {
    it('should add word to current round and update game', async () => {
      const players = TestDataFactory.createUsers(2);
      const round = TestDataFactory.createRound();
      const game = TestDataFactory.createStartedGame();
      game.players = players;
      game.rounds = [round];
      game.playersEmittedWords = {};
      
      const player = players[0];
      const word = 'test';
      const updatedGame = { ...game };
      
      vi.spyOn(gameService, 'getGame').mockResolvedValueOnce(game).mockResolvedValueOnce(updatedGame);
      vi.spyOn(gameService, 'getPlayer').mockResolvedValue(player);
      vi.spyOn(gameService, 'getLastRound').mockResolvedValue(round);
      vi.spyOn(mockGamesStorage, 'updateGame').mockResolvedValue(updatedGame);
      vi.spyOn(gameService, 'checkLastRound').mockResolvedValue(false);

      const result = await gameService.emitWord(game.id, word, player.id);

      expect(round.words).toHaveLength(1);
      expect(round.words[0]).toMatchObject({
        word,
        playerId: player.id,
        playerName: player.name,
      });
      expect(result.game).toEqual(updatedGame);
    });

    it('should throw error when player already emitted word', async () => {
      const player = TestDataFactory.createUser();
      const game = TestDataFactory.createStartedGame();
      game.playersEmittedWords = { [player.id]: 'already-emitted' };
      
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);
      vi.spyOn(gameService, 'getPlayer').mockResolvedValue(player);

      await expect(gameService.emitWord(game.id, 'test', player.id))
        .rejects.toThrow(`Player ${player.id} already emitted word`);
    });

    it('should throw error when game is not started', async () => {
      const game = TestDataFactory.createGame({ status: 'created' });
      const player = TestDataFactory.createUser();
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);
      vi.spyOn(gameService, 'getPlayer').mockResolvedValue(player);

      await expect(gameService.emitWord(game.id, 'test', player.id))
        .rejects.toThrow(`Game ${game.id} is not started or finished`);
    });

    it('should throw error when player is not in game', async () => {
      const game = TestDataFactory.createStartedGame();
      const player = TestDataFactory.createUser();
      game.playersEmittedWords = {};
      
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);
      vi.spyOn(gameService, 'getPlayer').mockResolvedValue(player);

      await expect(gameService.emitWord(game.id, 'test', player.id))
        .rejects.toThrow(`Player ${player.id} is not in game ${game.id}`);
    });
  });

  describe('checkIsRoundFinished', () => {
    it('should return true when all players have submitted words', async () => {
      const players = TestDataFactory.createUsers(2);
      const words = [
        TestDataFactory.createWord({ playerId: players[0].id }),
        TestDataFactory.createWord({ playerId: players[1].id }),
      ];
      const round = TestDataFactory.createRound({ words });
      const game = TestDataFactory.createGame({ players });
      
      vi.spyOn(gameService, 'getLastRound').mockResolvedValue(round);
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      const result = await gameService.checkIsRoundFinished(game.id);

      expect(result).toBe(true);
    });

    it('should return false when not all players have submitted words', async () => {
      const players = TestDataFactory.createUsers(3);
      const words = [TestDataFactory.createWord()];
      const round = TestDataFactory.createRound({ words });
      const game = TestDataFactory.createGame({ players });
      
      vi.spyOn(gameService, 'getLastRound').mockResolvedValue(round);
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      const result = await gameService.checkIsRoundFinished(game.id);

      expect(result).toBe(false);
    });
  });

  describe('checkIsGameFinished', () => {
    it('should return true when all players submitted the same word', async () => {
      const players = TestDataFactory.createUsers(2);
      const words = [
        TestDataFactory.createWord({ word: 'same', playerId: players[0].id }),
        TestDataFactory.createWord({ word: 'same', playerId: players[1].id }),
      ];
      const round = TestDataFactory.createRound({ words });
      const game = TestDataFactory.createGame({ players });
      
      vi.spyOn(gameService, 'getLastRound').mockResolvedValue(round);
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      const result = await gameService.checkIsGameFinished(game.id);

      expect(result).toBe(true);
    });

    it('should return false when players submitted different words', async () => {
      const players = TestDataFactory.createUsers(2);
      const words = [
        TestDataFactory.createWord({ word: 'different1', playerId: players[0].id }),
        TestDataFactory.createWord({ word: 'different2', playerId: players[1].id }),
      ];
      const round = TestDataFactory.createRound({ words });
      const game = TestDataFactory.createGame({ players });
      
      vi.spyOn(gameService, 'getLastRound').mockResolvedValue(round);
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      const result = await gameService.checkIsGameFinished(game.id);

      expect(result).toBe(false);
    });

    it('should return false when not all players have submitted', async () => {
      const players = TestDataFactory.createUsers(3);
      const words = [TestDataFactory.createWord()];
      const round = TestDataFactory.createRound({ words });
      const game = TestDataFactory.createGame({ players });
      
      vi.spyOn(gameService, 'getLastRound').mockResolvedValue(round);
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);

      const result = await gameService.checkIsGameFinished(game.id);

      expect(result).toBe(false);
    });
  });

  describe('deletePlayerFromGame', () => {
    it('should remove player from game and update storage', async () => {
      const players = TestDataFactory.createUsers(3);
      const game = TestDataFactory.createGame({ players });
      const playerToRemove = players[1];
      const expectedPlayers = [players[0], players[2]];
      const updatedGame = { ...game, players: expectedPlayers };
      
      vi.spyOn(gameService, 'getGame').mockResolvedValue(game);
      vi.spyOn(mockGamesStorage, 'updateGame').mockResolvedValue(updatedGame);

      const result = await gameService.deletePlayerFromGame(game.id, playerToRemove.id);

      expect(result).toEqual(updatedGame);
      expect(game.players).toEqual(expectedPlayers);
    });
  });

  describe('restartGame', () => {
    it('should reset game to created status', async () => {
      const game = TestDataFactory.createStartedGame();
      const resetGame = { 
        ...game, 
        status: 'created' as GameStatus, 
        rounds: [], 
        startWord: '' 
      };
      
      vi.spyOn(gameService, 'getGame').mockResolvedValueOnce(game).mockResolvedValueOnce(resetGame);
      vi.spyOn(mockGamesStorage, 'updateGame').mockResolvedValue(resetGame);

      const result = await gameService.restartGame(game.id);

      expect(mockGamesStorage.updateGame).toHaveBeenCalledWith(game.id, {
        status: 'created',
        rounds: [],
        startWord: '',
        playersEmittedWords: {},
      });
      expect(result).toEqual(resetGame);
    });
  });
});