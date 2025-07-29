import { GameService } from "../services/gameService";
import { Request, Response } from "express";

export class GameController {
  private gameService: GameService;

  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  async createGame(req: Request, res: Response): Promise<void> {
    try {
      const game = this.gameService.createGame(req.body.playerId);
      res.status(200).json({ game });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async joinGame(req: Request, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;
      const game = this.gameService.addPlayerToGame(gameId, playerId);
      res.status(200).json({ game });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
