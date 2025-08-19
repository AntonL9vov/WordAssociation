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
import { GameStatus } from "../types/game";
import { gameEntity } from "..";
import { gameSocketEvents } from "../socket-entities/game-scoket/game-socket-events";

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
  constructor(private gameService: GameService) {
    super();
  }

  @Post()
  @SuccessResponse(201, "Game created")
  public async createGame(@Body() body: CreateGameRequest): Promise<Game> {
    try {
      const game = this.gameService.createGame(body.playerId);
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
      const game = this.gameService.addPlayerToGame(gameId, body.playerId);
      
      // Notify all players in the game room about the updated game state
      const room = `game:${game.id}`;
      const io = gameEntity.baseSocket.getIO();
      
      console.log("🎯 About to emit to room:", room, "Players count:", game.players.length);
      console.log("🎯 Room clients count:", io.sockets.adapter.rooms.get(room)?.size || 0);
      
      io.to(room).emit("game:player:joined", game);
      console.log("📤 Emitted game:player:joined to room:", room);
      
      return { ...game };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }

  @Get("/is-player-in-game/{playerId}")
  public async isPlayerInGame(@Path() playerId: string): Promise<Game | null> {
    const game = this.gameService.isPlayerInGameByPlayerId(playerId);
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
      const game = this.gameService.startGame(gameId, body.startWord);
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
