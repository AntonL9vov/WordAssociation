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
import { User } from "./users.controller";

export interface Game {
  /** @example "game-123" */
  id: string;
  rounds: any[];
  players: User[];
  /** @example false */
  isStarted: boolean;
  /** @example false */
  isFinished: boolean;
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
  constructor(private gameService: GameService) {
    super();
  }

  @Post()
  @SuccessResponse(201, "Game created")
  public async createGame(
    @Body() body: CreateGameRequest
  ): Promise<{ game: Game }> {
    try {
      const game = this.gameService.createGame(body.playerId);
      this.setStatus(201);
      return { game };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }

  @Post("{gameId}/join")
  public async joinGame(
    @Path() gameId: string,
    @Body() body: { playerId: string }
  ): Promise<{ game: Game }> {
    try {
      const game = this.gameService.addPlayerToGame(gameId, body.playerId);
      return { game };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }

  @Get("/is-player-in-game/{playerId}")
  public async isPlayerInGame(
    @Path() playerId: string
  ): Promise<{ game: Game | null }> {
    const game = this.gameService.isPlayerInGameByPlayerId(playerId);
    if (!game) {
      this.setStatus(204);
      return { game: null };
    }
    this.setStatus(200);
    return { game };
  }

  @Post("{gameId}/start")
  public async startGame(
    @Path() gameId: string,
    @Body() body: { startWord: string }
  ): Promise<{ game: Game }> {
    try {
      const game = this.gameService.startGame(gameId, body.startWord);
      return { game };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }
}
