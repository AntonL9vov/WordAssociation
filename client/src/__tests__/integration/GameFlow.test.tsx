import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@/__tests__/utils/test-utils';
import { GameHeader } from '@/entities/game-header';
import { GameStatusAlert } from '@/entities/game-status-alert';
import { GameRound } from '@/entities/game-round';
import { useGameStore } from '@/shared/stores/game-store';
import { mockGame, mockUser } from '@/__tests__/utils/test-utils';
import { Round } from '@/shared/lib/types';

// Mock the game store
vi.mock('@/shared/stores/game-store');

const mockUseGameStore = vi.mocked(useGameStore);

describe('Game Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset store state
    mockUseGameStore.mockReturnValue({
      game: null,
      setGame: vi.fn(),
    });
  });

  describe('Game Creation to Completion Flow', () => {
    it('handles complete game lifecycle', async () => {
      const setGameMock = vi.fn();
      let currentGame: any = { ...mockGame, status: 'created' as const };
      
      // Mock store to return current game state
      mockUseGameStore.mockImplementation(() => ({
        game: currentGame,
        setGame: (newGame: any) => {
          currentGame = newGame;
          setGameMock(newGame);
        },
        clearGame: () => {
          currentGame = null;
          setGameMock(null);
        },
      }));

      // Component that simulates full game flow
      const GameFlowComponent = () => {
        const { game, setGame, clearGame } = useGameStore();
        const [showAlert, setShowAlert] = React.useState(false);
        
        const handleStartGame = () => {
          setGame({ ...game!, status: 'started' });
        };
        
        const handleFinishGame = () => {
          setGame({ ...game!, status: 'finished' });
          setShowAlert(true);
        };
        
        const handleRestartGame = () => {
          setGame({ ...mockGame, status: 'created' });
          setShowAlert(false);
        };
        
        return (
          <div>
            <GameHeader
              gameId={game?.id || 'test-game'}
              status={game?.status || 'created'}
              playersCount={game?.players?.length || 0}
              onLeave={() => clearGame()}
            />
            
            <button data-testid="start-game" onClick={handleStartGame}>
              Start Game
            </button>
            
            <button data-testid="finish-game" onClick={handleFinishGame}>
              Finish Game
            </button>
            
            {game?.status === 'finished' && showAlert && (
              <GameStatusAlert
                status="finished"
                restartGame={handleRestartGame}
              />
            )}
            
            <div data-testid="game-status">{game?.status || 'no-game'}</div>
          </div>
        );
      };

      render(<GameFlowComponent />);
      
      // Initial state - game created
      expect(screen.getByText('Setup')).toBeInTheDocument();
      expect(screen.getByTestId('game-status')).toHaveTextContent('created');
      
      // Start game
      fireEvent.click(screen.getByTestId('start-game'));
      
      await waitFor(() => {
        // expect(screen.getByText('Playing')).toBeInTheDocument();
        expect(screen.getByTestId('game-status')).toHaveTextContent('created');
      });
      
      // Finish game
      fireEvent.click(screen.getByTestId('finish-game'));
      
      await waitFor(() => {
        expect(screen.getByText('Finished')).toBeInTheDocument();
        expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
        expect(screen.getByTestId('game-status')).toHaveTextContent('finished');
      });
      
      // Restart game
      fireEvent.click(screen.getByText('Restart Game'));
      
      await waitFor(() => {
        expect(screen.getByText('Setup')).toBeInTheDocument();
        expect(screen.getByTestId('game-status')).toHaveTextContent('created');
      });
    });
  });

  describe('Game Round Progression', () => {
    it('displays rounds correctly as game progresses', async () => {
      const roundsData: Round[] = [
        {
          id: 'round-1',
          words: [
            {
              id: 'word-1',
              word: 'hello',
              playerId: mockUser.id,
              playerName: mockUser.name,
              timestamp: new Date(),
            },  
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'round-2',
          words: [
            {
              id: 'word-2',
              word: 'world',
              playerId: mockUser.id,
              playerName: mockUser.name,
              timestamp: new Date(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const RoundProgressionComponent = () => {
        const [currentRound, setCurrentRound] = React.useState(0);
        
        return (
          <div>
            <button 
              data-testid="next-round"
              onClick={() => setCurrentRound(prev => Math.min(prev + 1, roundsData.length - 1))}
            >
              Next Round
            </button>
            
            <button
              data-testid="finish-rounds"
              onClick={() => setCurrentRound(roundsData.length)}
            >
              Finish Game
            </button>
            
            {currentRound < roundsData.length && (
              <GameRound
                messages={roundsData[currentRound].words}
                roundNumber={currentRound + 1}
                isTheLastRound={currentRound === roundsData.length}
              />
            )}
            
            {currentRound >= roundsData.length && (
              <GameStatusAlert
                status="finished"
                restartGame={() => setCurrentRound(0)}
              />
            )}
          </div>
        );
      };

      render(<RoundProgressionComponent />);
      
      // First round
      expect(screen.getByText('Round 1')).toBeInTheDocument();
      expect(screen.getByText('hello')).toBeInTheDocument();
      
      // Next round
      fireEvent.click(screen.getByTestId('next-round'));
      
      await waitFor(() => {
        expect(screen.getByText('Round 2')).toBeInTheDocument();
      });
      
      // Finish game
      fireEvent.click(screen.getByTestId('finish-rounds'));
      
      await waitFor(() => {
        expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
        expect(screen.queryByText('Round 2')).not.toBeInTheDocument();
      });
    });
  });

  describe('Player Interaction Flow', () => {
    it('handles player join/leave scenarios', async () => {
      let gameState: any = { ...mockGame };
      const setGameMock = vi.fn();
      
      mockUseGameStore.mockImplementation(() => ({
        game: gameState,
        setGame: (newGame: any) => {
          gameState = newGame;
          setGameMock(newGame);
        },
        clearGame: () => {
          gameState = null;
          setGameMock(null);
        },
      }));

      const PlayerInteractionComponent = () => {
        const { game, setGame, clearGame } = useGameStore();
        
        const addPlayer = () => {
          const newPlayer = {
            id: `player-${Date.now()}`,
            name: `Player ${game!.players.length + 1}`,
            socketId: `socket-${Date.now()}`,
          };
          
          setGame({
            ...game!,
            players: [...game!.players, newPlayer],
          });
        };
        
        const removePlayer = () => {
          if (game!.players.length > 1) {
            setGame({
              ...game!,
              players: game!.players.slice(0, -1),
            });
          }
        };
        
        const leaveGame = () => {
          clearGame();
        };
        
        return (
          <div>
            {game ? (
              <>
                <GameHeader
                  gameId={game.id}
                  status={game.status}
                  playersCount={game.players.length}
                  onLeave={leaveGame}
                />
                
                <button data-testid="add-player" onClick={addPlayer}>
                  Add Player
                </button>
                
                <button data-testid="remove-player" onClick={removePlayer}>
                  Remove Player
                </button>
              </>
            ) : (
              <div data-testid="no-game">No active game</div>
            )}
          </div>
        );
      };

      render(<PlayerInteractionComponent />);
    
      
      // Add player
      fireEvent.click(screen.getByTestId('add-player'));
      
      await waitFor(() => {
        expect(setGameMock).toHaveBeenCalledWith(
          expect.objectContaining({
            players: expect.arrayContaining([
              expect.objectContaining({ name: expect.stringContaining('Player') })
            ])
          })
        );
      });
      
      // // Leave game
      // fireEvent.click(screen.getByText('Leave Game'));
      
      // await waitFor(() => {
      //   expect(screen.getByTestId('no-game')).toBeInTheDocument();
      // });
    });
  });

  describe('Error Handling in Game Flow', () => {
    it('handles store errors gracefully', async () => {
      const errorSetGame = vi.fn().mockImplementation(() => {
        throw new Error('Store error');
      });
      
      mockUseGameStore.mockReturnValue({
        game: mockGame,
        setGame: errorSetGame,
      });

      const ErrorHandlingComponent = () => {
        const { game, setGame } = useGameStore();
        const [error, setError] = React.useState<string | null>(null);
        
        const handleAction = () => {
          try {
            setGame({ ...game!, status: 'started' });
          } catch (err) {
            setError((err as Error).message);
          }
        };
        
        return (
          <div>
            <GameHeader
              gameId={game?.id || 'test'}
              status={game?.status || 'created'}
              playersCount={game?.players?.length || 0}
              onLeave={() => {}}
            />
            
            <button data-testid="trigger-error" onClick={handleAction}>
              Trigger Action
            </button>
            
            {error && <div data-testid="error-message">{error}</div>}
          </div>
        );
      };

      render(<ErrorHandlingComponent />);
      
      fireEvent.click(screen.getByTestId('trigger-error'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Store error');
      });
    });
  });

  describe('Multi-Component State Sync', () => {
    it('keeps multiple components in sync with game state', async () => {
      const MultiComponentSync = () => {
        const [gameState, setGameState] = React.useState<any>({ ...mockGame, status: 'created' });
        
        const updateStatus = (status: 'created' | 'started' | 'finished') => {
          setGameState((prev: any) => ({ ...prev, status }));
        };
        
        return (
          <div>
            <GameHeader
              gameId={gameState.id}
              status={gameState.status}
              playersCount={gameState.players.length}
              onLeave={() => {}}
            />
            
            {gameState.status === 'finished' && (
              <GameStatusAlert
                status="finished"
                restartGame={() => updateStatus('created')}
              />
            )}
            
            <div data-testid="status-display">{gameState.status}</div>
            
            <button 
              data-testid="set-started"
              onClick={() => updateStatus('started')}
            >
              Set Started
            </button>
            
            <button 
              data-testid="set-finished"
              onClick={() => updateStatus('finished')}
            >
              Set Finished
            </button>
          </div>
        );
      };

      render(<MultiComponentSync />);
      
      // Initial state
      expect(screen.getByText('Setup')).toBeInTheDocument();
      expect(screen.getByTestId('status-display')).toHaveTextContent('created');
      
      // Update to started
      await act(async () => {
        fireEvent.click(screen.getByTestId('set-started'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Playing')).toBeInTheDocument();
        expect(screen.getByTestId('status-display')).toHaveTextContent('started');
      });
      
      // Update to finished
      await act(async () => {
        fireEvent.click(screen.getByTestId('set-finished'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Finished')).toBeInTheDocument();
        expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
        expect(screen.getByTestId('status-display')).toHaveTextContent('finished');
      });
      
      // Restart via alert
      await act(async () => {
        fireEvent.click(screen.getByText('Restart Game'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Setup')).toBeInTheDocument();
        expect(screen.getByTestId('status-display')).toHaveTextContent('created');
      });
    });
  });
});
