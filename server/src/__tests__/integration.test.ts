import { describe, it, expect, beforeEach } from 'vitest';
import { UsersStorage } from '../storages/usersStorage';
import { GamesStorage } from '../storages/gamesStorage';
import { UsersService } from '../services/usersService';
import { GameService } from '../services/gameService';
import { TestDataFactory } from './testDataFactory';

describe('Integration Tests - Game Flow', () => {
  let usersStorage: UsersStorage;
  let gamesStorage: GamesStorage;
  let usersService: UsersService;
  let gameService: GameService;

  beforeEach(() => {
    usersStorage = new UsersStorage();
    gamesStorage = new GamesStorage();
    usersService = new UsersService(usersStorage);
    gameService = new GameService(gamesStorage, usersService);
  });

  describe('Complete Game Flow', () => {
    it('should handle a complete game lifecycle', async () => {
      // 1. Create users
      const player1 = await usersService.addUser('Alice');
      const player2 = await usersService.addUser('Bob');
      
      expect(player1.name).toBe('Alice');
      expect(player2.name).toBe('Bob');
      const allUsers = await usersService.getAllUsers();
      expect(allUsers).toHaveLength(2);

      // 2. Create a game
      const game = await gameService.createGame(player1.id);
      expect(game.players).toHaveLength(1);
      expect(game.players[0]).toEqual(player1);
      expect(game.status).toBe('created');

      // 3. Add second player
      const gameWithTwoPlayers = await gameService.addPlayerToGame(game.id, player2.id);
      expect(gameWithTwoPlayers.players).toHaveLength(2);
      expect(gameWithTwoPlayers.players).toContain(player1);
      expect(gameWithTwoPlayers.players).toContain(player2);

      // 4. Start the game
      const startedGame = await gameService.startGame(game.id, 'начальное_слово');
      expect(startedGame.status).toBe('started');
      expect(startedGame.startWord).toBe('начальное_слово');
      expect(startedGame.rounds).toHaveLength(1);

      // 5. Players emit words (different words - game continues)
      const emitResult1 = await gameService.emitWord(game.id, 'слово1', player1.id);
      expect(emitResult1.playersEmittedWords[player1.id]).toBe('слово1');
      
      const emitResult2 = await gameService.emitWord(game.id, 'слово2', player2.id);
      // After both players emit words, a new round is created and playersEmittedWords is reset
      expect(emitResult2.playersEmittedWords).toEqual({});
      
      // Round should be finished and new round should be created (different words)
      const roundFinished = await gameService.checkIsRoundFinished(game.id);
      expect(roundFinished).toBe(false); // New round, no words yet
      
      // Should have started a new round
      const gameAfterRound1 = await gameService.getGame(game.id);
      expect(gameAfterRound1.rounds).toHaveLength(2);
      expect(gameAfterRound1.status).toBe('started');
      
      // Verify the first round has the words
      expect(gameAfterRound1.rounds[0].words).toHaveLength(2);
      expect(gameAfterRound1.rounds[0].words.map(w => w.word)).toContain('слово1');
      expect(gameAfterRound1.rounds[0].words.map(w => w.word)).toContain('слово2');

      // 6. Second round - players emit the same word (game ends)
      const emitResult3 = await gameService.emitWord(game.id, 'финиш', player1.id);
      expect(emitResult3.playersEmittedWords[player1.id]).toBe('финиш');
      
      const emitResult4 = await gameService.emitWord(game.id, 'финиш', player2.id);
      expect(emitResult4.playersEmittedWords[player2.id]).toBe('финиш');
      
      // Game should be finished
      const finalGame = await gameService.getGame(game.id);
      expect(finalGame.status).toBe('finished');
      const gameFinished = await gameService.checkIsGameFinished(game.id);
      expect(gameFinished).toBe(true);
    });

    it('should handle player leaving and rejoining', async () => {
      // Create users and game
      const player1 = await usersService.addUser('Alice');
      const player2 = await usersService.addUser('Bob');
      const player3 = await usersService.addUser('Charlie');
      
      const game = await gameService.createGame(player1.id);
      await gameService.addPlayerToGame(game.id, player2.id);
      await gameService.addPlayerToGame(game.id, player3.id);
      
      const gameWith3Players = await gameService.getGame(game.id);
      expect(gameWith3Players.players).toHaveLength(3);

      // Player leaves
      const gameAfterLeave = await gameService.deletePlayerFromGame(game.id, player2.id);
      expect(gameAfterLeave.players).toHaveLength(2);
      expect(gameAfterLeave.players.map(p => p.id)).not.toContain(player2.id);

      // Player rejoins
      const gameAfterRejoin = await gameService.addPlayerToGame(game.id, player2.id);
      expect(gameAfterRejoin.players).toHaveLength(3);
      expect(gameAfterRejoin.players.map(p => p.id)).toContain(player2.id);
    });

    it('should handle game restart', async () => {
      // Create and start a game
      const player1 = await usersService.addUser('Alice');
      const player2 = await usersService.addUser('Bob');
      
      const game = await gameService.createGame(player1.id);
      await gameService.addPlayerToGame(game.id, player2.id);
      const startedGame = await gameService.startGame(game.id, 'начальное_слово');
      
      expect(startedGame.status).toBe('started');
      expect(startedGame.rounds).toHaveLength(1);

      // Emit some words
      await gameService.emitWord(game.id, 'слово1', player1.id);
      await gameService.emitWord(game.id, 'слово2', player2.id);

      // Restart the game
      const restartedGame = await gameService.restartGame(game.id);
      
      expect(restartedGame.status).toBe('created');
      expect(restartedGame.rounds).toHaveLength(0);
      expect(restartedGame.startWord).toBe('');
      expect(restartedGame.players).toHaveLength(2); // Players should remain
    });

    it('should handle user deletion across multiple games', async () => {
      // Create users
      const player1 = await usersService.addUser('Alice');
      const player2 = await usersService.addUser('Bob');
      const player3 = await usersService.addUser('Charlie');

      // Create multiple games with the same player
      const game1 = await gameService.createGame(player1.id);
      await gameService.addPlayerToGame(game1.id, player2.id);
      
      const game2 = await gameService.createGame(player2.id); // player2 in multiple games
      await gameService.addPlayerToGame(game2.id, player3.id);

      const game1State = await gameService.getGame(game1.id);
      const game2State = await gameService.getGame(game2.id);
      expect(game1State.players).toHaveLength(2);
      expect(game2State.players).toHaveLength(2);

      // Delete player2 from all games
      const updatedGames = await gameService.deleteUserFromAllGames(player2.id);
      await usersService.deleteUser(player2.id);

      expect(updatedGames).toHaveLength(2); // Both games were updated
      const finalGame1 = await gameService.getGame(game1.id);
      const finalGame2 = await gameService.getGame(game2.id);
      expect(finalGame1.players).toHaveLength(1);
      expect(finalGame2.players).toHaveLength(1);
      const deletedUser = await usersService.getUser(player2.id);
      expect(deletedUser).toBeUndefined();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle various error scenarios', async () => {
      const player1 = await usersService.addUser('Alice');
      const game = await gameService.createGame(player1.id);

      // Try to start game with only one player
      await expect(gameService.startGame(game.id, 'слово')).rejects.toThrow('has less than 2 players');

      // Add second player and start game
      const player2 = await usersService.addUser('Bob');
      await gameService.addPlayerToGame(game.id, player2.id);
      await gameService.startGame(game.id, 'начальное_слово');

      // Try to add player to started game
      const player3 = await usersService.addUser('Charlie');
      await expect(gameService.addPlayerToGame(game.id, player3.id)).rejects.toThrow('is already started');

      // Try to emit word twice for same player
      await gameService.emitWord(game.id, 'слово1', player1.id);
      await expect(gameService.emitWord(game.id, 'слово2', player1.id)).rejects.toThrow('already emitted word');

      // Try to emit word for non-existent player
      await expect(gameService.emitWord(game.id, 'слово', 'non-existent')).rejects.toThrow('not found');
    });
  });

  describe('Game State Consistency', () => {
    it('should maintain consistent state throughout game lifecycle', async () => {
      const player1 = await usersService.addUser('Alice');
      const player2 = await usersService.addUser('Bob');
      
      const game = await gameService.createGame(player1.id);
      const gameId = game.id;

      // Verify initial state
      const initialGame = await gameService.getGame(gameId);
      expect(initialGame.status).toBe('created');
      expect(initialGame.rounds).toHaveLength(0);
      const player1InGame = await gameService.isPlayerInGame(gameId, player1.id);
      expect(player1InGame).toBeTruthy();
      const player1InAnyGame = await gameService.isPlayerInGameByPlayerId(player1.id);
      expect(player1InAnyGame).toBeTruthy();

      // Add player and verify state
      await gameService.addPlayerToGame(gameId, player2.id);
      const gameWithTwoPlayers = await gameService.getGame(gameId);
      expect(gameWithTwoPlayers.players).toHaveLength(2);
      const player2InGame = await gameService.isPlayerInGame(gameId, player2.id);
      expect(player2InGame).toBeTruthy();

      // Start game and verify state
      await gameService.startGame(gameId, 'начальное_слово');
      const startedGame = await gameService.getGame(gameId);
      expect(startedGame.status).toBe('started');
      expect(startedGame.rounds).toHaveLength(1);
      const lastRound = await gameService.getLastRound(gameId);
      expect(lastRound).toBeTruthy();

      // Verify round state management
      const roundFinished1 = await gameService.checkIsRoundFinished(gameId);
      expect(roundFinished1).toBe(false);
      
      await gameService.emitWord(gameId, 'слово1', player1.id);
      const roundFinished2 = await gameService.checkIsRoundFinished(gameId);
      expect(roundFinished2).toBe(false); // Still waiting for player2
      
      await gameService.emitWord(gameId, 'слово2', player2.id);
      // After both players emit, round is finished and new round is created automatically
      const roundFinished3 = await gameService.checkIsRoundFinished(gameId);
      expect(roundFinished3).toBe(false); // New round has no words yet
      
      // New round should be created
      const gameAfterRound = await gameService.getGame(gameId);
      expect(gameAfterRound.rounds).toHaveLength(2);
      expect(Object.keys(gameAfterRound.playersEmittedWords)).toHaveLength(0); // Reset for new round
    });
  });
});