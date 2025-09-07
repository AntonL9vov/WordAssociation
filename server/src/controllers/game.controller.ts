import {
  Controller,
  Post,
  Route,
  Path,
  Body,
  Tags,
  Response,
  SuccessResponse,
  Get,
} from "tsoa";
import { GameService } from "../services/gameService";
import { SocketEmitterService } from "../services/socketEmitterService";
import { User } from "./users.controller";
import { GameStatus } from "../types/game";

export interface Game {
  /** @example "game-123" */
  id: string;
  rounds: any[];
  players: User[];
  /** @example false */
  status: GameStatus;
  /** @example "hello" */
  startWord: string;
  /** @example "2023-01-01T00:00:00Z" */
  createdAt: Date;
  /** @example "2023-01-01T00:00:00Z" */
  updatedAt: Date;
}

export interface CreateGameRequest {
  /** @example "user-123" */
  playerId: string;
}

@Route("api/games")
@Tags("Games")
export class GameController extends Controller {
  constructor(
    private gameService: GameService,
    private socketEmitterService: SocketEmitterService
  ) {
    super();
  }

  @Post()
  @SuccessResponse(201, "Game created")
  public async createGame(@Body() body: CreateGameRequest): Promise<Game> {
    try {
      const game = await this.gameService.createGame(body.playerId);
      this.setStatus(201);
      return { ...game };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }

  @Post("{gameId}/join")
  public async joinGame(
    @Path() gameId: string,
    @Body() body: { playerId: string }
  ): Promise<Game> {
    try {
      const game = await this.gameService.addPlayerToGame(gameId, body.playerId);
      
      // Notify all players in the game room about the updated game state
      this.socketEmitterService.emitPlayersUpdated(game);
      
      return { ...game };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }

  @Get("{gameId}/restart")
  public async restartGame(@Path() gameId: string): Promise<Game> {
    const game = await this.gameService.restartGame(gameId);
    
    // Emit restart event through socket
    this.socketEmitterService.emitGameRestarted(game);
    
    return { ...game };
  }
  
  @Post("{gameId}/leave")
  public async leaveGame(@Path() gameId: string, @Body() body: { playerId: string }): Promise<Game> {
    const game = await this.gameService.deletePlayerFromGame(gameId, body.playerId);
    
    // Emit players update event through socket
    this.socketEmitterService.emitPlayersUpdated(game);
    
    return { ...game };
  } 

  @Get("/is-player-in-game/{playerId}")
  public async isPlayerInGame(@Path() playerId: string): Promise<Game | null> {
    const game = await this.gameService.isPlayerInGameByPlayerId(playerId);
    if (!game) {
      this.setStatus(204);
      return null;
    }
    this.setStatus(200);
    return { ...game };
  }

  @Post("{gameId}/start")
  public async startGame(
    @Path() gameId: string,
    @Body() body: { startWord: string }
  ): Promise<Game> {
    try {
      const game = await this.gameService.startGame(gameId, body.startWord);
      
      // Emit game start event through socket
      this.socketEmitterService.emitGameStarted(game);
      
      return { ...game };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }

  @Get("/get-random-word")
  public async getRandomWord(): Promise<{ word: string }> {
    const words = [
      "море",
      "ветер",
      "смысл",
      "луч",
      "игра",
      "связь",
      "мост",
      "шаг",
      "искра",
      "путь",
      "стихия",
      "облако",
      "снег",
      "тропа",
      "свет",
      "заря",
      "момент",
      "миг",
      "мысль",
      "узор",
    ];
    const word = words[Math.floor(Math.random() * words.length)];
    return { word };
  }
}
