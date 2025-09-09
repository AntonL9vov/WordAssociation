import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/shared/stores/game-store';

// Mock game data
const mockGame = {
  id: 'test-game-1',
  status: 'created' as const,
  players: [
    { id: 'player-1', name: 'Player 1', socketId: 'socket-1' },
    { id: 'player-2', name: 'Player 2', socketId: 'socket-2' },
  ],
  playersEmittedWords: {},
  rounds: [],
  startWord: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockUpdatedGame = {
  ...mockGame,
  status: 'started' as const,
  startWord: 'hello',
  playersEmittedWords: {
    'player-1': true,
  },
};

describe('GameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.setState({ game: null });
  });

  describe('Initial State', () => {
    it('has null game initially', () => {
      const state = useGameStore.getState();
      expect(state.game).toBeNull();
    });

    it('provides setGame function', () => {
      const state = useGameStore.getState();
      expect(typeof state.setGame).toBe('function');
    });
  });

  describe('setGame Action', () => {
    it('sets game correctly', () => {
      const { setGame } = useGameStore.getState();
      
      setGame(mockGame);
      
      const state = useGameStore.getState();
      expect(state.game).toEqual(mockGame);
    });

    it('updates existing game', () => {
      const { setGame } = useGameStore.getState();
      
      // Set initial game
      setGame(mockGame);
      
      // Update game
      setGame(mockUpdatedGame);
      
      const state = useGameStore.getState();
      expect(state.game).toEqual(mockUpdatedGame);
      expect(state.game?.status).toBe('started');
      expect(state.game?.startWord).toBe('hello');
    });

    it('can set game to null', () => {
      const { setGame } = useGameStore.getState();
      
      // Set initial game
      setGame(mockGame);
      expect(useGameStore.getState().game).toEqual(mockGame);
      
      // Clear game
      setGame(null);
      expect(useGameStore.getState().game).toBeNull();
    });

    it('preserves game reference when setting same data', () => {
      const { setGame } = useGameStore.getState();
      
      setGame(mockGame);
      const firstGame = useGameStore.getState().game;
      
      setGame(mockGame);
      const secondGame = useGameStore.getState().game;
      
      expect(firstGame).toBe(secondGame);
    });
  });

  describe('Game State Management', () => {
    it('handles game status changes', () => {
      const { setGame } = useGameStore.getState();
      
      // Start with created game
      setGame(mockGame);
      expect(useGameStore.getState().game?.status).toBe('created');
      
      // Update to started
      setGame({ ...mockGame, status: 'started' });
      expect(useGameStore.getState().game?.status).toBe('started');
      
      // Update to finished
      setGame({ ...mockGame, status: 'finished' });
      expect(useGameStore.getState().game?.status).toBe('finished');
    });

    it('handles player list updates', () => {
      const { setGame } = useGameStore.getState();
      
      setGame(mockGame);
      expect(useGameStore.getState().game?.players).toHaveLength(2);
      
      const newPlayer = { id: 'player-3', name: 'Player 3', socketId: 'socket-3' };
      const updatedGame = {
        ...mockGame,
        players: [...mockGame.players, newPlayer],
      };
      
      setGame(updatedGame);
      expect(useGameStore.getState().game?.players).toHaveLength(3);
      expect(useGameStore.getState().game?.players).toContain(newPlayer);
    });

    it('handles rounds updates', () => {
      const { setGame } = useGameStore.getState();
      
      const gameWithRounds = {
        ...mockGame,
        rounds: [
          {
            id: 'round-1',
            gameId: 'test-game-1',
            roundNumber: 1,
            words: [
              {
                id: 'word-1',
                word: 'test',
                userId: 'player-1',
                gameId: 'test-game-1',
                roundId: 'round-1',
                createdAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
      
      setGame(gameWithRounds);
      expect(useGameStore.getState().game?.rounds).toHaveLength(1);
      expect(useGameStore.getState().game?.rounds[0].words).toHaveLength(1);
    });

    it('handles playersEmittedWords updates', () => {
      const { setGame } = useGameStore.getState();
      
      setGame(mockGame);
      expect(useGameStore.getState().game?.playersEmittedWords).toEqual({});
      
      const gameWithEmittedWords = {
        ...mockGame,
        playersEmittedWords: {
          'player-1': true,
          'player-2': false,
        },
      };
      
      setGame(gameWithEmittedWords);
      expect(useGameStore.getState().game?.playersEmittedWords).toEqual({
        'player-1': true,
        'player-2': false,
      });
    });
  });

  describe('Store Persistence', () => {
    it('maintains state across multiple access', () => {
      const { setGame } = useGameStore.getState();
      
      setGame(mockGame);
      
      // Access state multiple times
      const state1 = useGameStore.getState();
      const state2 = useGameStore.getState();
      const state3 = useGameStore.getState();
      
      expect(state1.game).toBe(state2.game);
      expect(state2.game).toBe(state3.game);
    });

    it('notifies subscribers on changes', () => {
      const { setGame } = useGameStore.getState();
      
      let notificationCount = 0;
      const unsubscribe = useGameStore.subscribe(() => {
        notificationCount++;
      });
      
      setGame(mockGame);
      setGame(mockUpdatedGame);
      setGame(null);
      
      expect(notificationCount).toBe(3);
      
      unsubscribe();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined game data gracefully', () => {
      const { setGame } = useGameStore.getState();
      
      expect(() => {
        setGame(undefined as any);
      }).not.toThrow();
    });

    it('handles partial game updates', () => {
      const { setGame } = useGameStore.getState();
      
      const partialGame = {
        id: 'partial-game',
        status: 'created' as const,
      } as any;
      
      expect(() => {
        setGame(partialGame);
      }).not.toThrow();
      
      expect(useGameStore.getState().game?.id).toBe('partial-game');
    });

    it('handles concurrent updates', () => {
      const { setGame } = useGameStore.getState();
      
      // Simulate concurrent updates
      setGame(mockGame);
      setGame(mockUpdatedGame);
      setGame({ ...mockGame, status: 'finished' });
      
      const finalState = useGameStore.getState();
      expect(finalState.game?.status).toBe('finished');
    });
  });

  describe('Memory Management', () => {
    it('properly releases references when clearing game', () => {
      const { setGame } = useGameStore.getState();
      
      setGame(mockGame);
      expect(useGameStore.getState().game).not.toBeNull();
      
      setGame(null);
      expect(useGameStore.getState().game).toBeNull();
    });

    it('handles repeated setGame calls efficiently', () => {
      const { setGame } = useGameStore.getState();
      
      // Set game multiple times with same data
      for (let i = 0; i < 100; i++) {
        setGame(mockGame);
      }
      
      expect(useGameStore.getState().game).toEqual(mockGame);
    });
  });
});
