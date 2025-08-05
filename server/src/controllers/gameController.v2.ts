import { Controller, Post, Route, Path, Body, Tags, Response, Example, SuccessResponse } from 'tsoa';
import { GameService } from '../services/gameService';
import { Game, CreateGameRequest, JoinGameRequest, IsPlayerInGameRequest, GameResponse } from '../models/game.model';
import { ErrorResponse } from '../models/common.model';

@Route('api/games')
@Tags('Games')
export class GameControllerV2 extends Controller {
  constructor(private gameService: GameService) {
    super();
  }

  /**
   * Создать новую игру
   * @summary Create a new game
   */
  @Post()
  @SuccessResponse(201, 'Game created successfully')
  @Response<ErrorResponse>(400, 'Bad request - invalid input')
  @Response<ErrorResponse>(500, 'Internal server error')
  @Example<GameResponse>({
    game: {
      id: 'game-123',
      rounds: [],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
      startWord: '',
      isFinished: false,
      isStarted: false,
      players: [{ id: 'user-123', name: 'John Doe' }]
    }
  })
  public async createGame(@Body() body: CreateGameRequest): Promise<GameResponse> {
    try {
      const { playerId } = body;
      
      if (!playerId || typeof playerId !== 'string' || playerId.trim().length === 0) {
        this.setStatus(400);
        throw new Error('Player ID is required and must be a non-empty string');
      }

      const game = this.gameService.createGame(playerId);
      this.setStatus(201);
      return { game };
    } catch (error) {
      if (this.getStatus() === 400) {
        throw error;
      }
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Присоединиться к игре
   * @summary Join a game
   */
  @Post('{gameId}/join')
  @Response<ErrorResponse>(400, 'Bad request - invalid input')
  @Response<ErrorResponse>(404, 'Game not found')
  @Response<ErrorResponse>(500, 'Internal server error')
  @Example<GameResponse>({
    game: {
      id: 'game-123',
      rounds: [],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
      startWord: 'hello',
      isFinished: false,
      isStarted: true,
      players: [
        { id: 'user-123', name: 'John Doe' },
        { id: 'user-456', name: 'Jane Smith' }
      ]
    }
  })
  public async joinGame(@Path() gameId: string, @Body() body: JoinGameRequest): Promise<GameResponse> {
    try {
      const { playerId } = body;
      
      if (!playerId || typeof playerId !== 'string' || playerId.trim().length === 0) {
        this.setStatus(400);
        throw new Error('Player ID is required and must be a non-empty string');
      }

      const game = this.gameService.addPlayerToGame(gameId, playerId);
      return { game };
    } catch (error) {
      if (this.getStatus() === 400) {
        throw error;
      }
      
      // Проверяем на специфичные ошибки игрового сервиса
      if (error instanceof Error && error.message.includes('not found')) {
        this.setStatus(404);
        throw error;
      }
      
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Проверить, находится ли игрок в игре
   * @summary Check if player is in a game
   */
  @Post('is-player-in-game')
  @Response<ErrorResponse>(404, 'Player not found in game')
  @Response<ErrorResponse>(400, 'Bad request - invalid input')
  @Response<ErrorResponse>(500, 'Internal server error')
  @Example<GameResponse>({
    game: {
      id: 'game-123',
      rounds: [],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
      startWord: 'hello',
      isFinished: false,
      isStarted: true,
      players: [{ id: 'user-123', name: 'John Doe' }]
    }
  })
  public async isPlayerInGame(@Body() body: IsPlayerInGameRequest): Promise<GameResponse> {
    try {
      const { playerId } = body;
      
      if (!playerId || typeof playerId !== 'string' || playerId.trim().length === 0) {
        this.setStatus(400);
        throw new Error('Player ID is required and must be a non-empty string');
      }

      const game = this.gameService.isPlayerInGameByPlayerId(playerId);
      if (!game) {
        this.setStatus(404);
        throw new Error('Player not found in game');
      }
      
      return { game };
    } catch (error) {
      if (this.getStatus() === 400 || this.getStatus() === 404) {
        throw error;
      }
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}