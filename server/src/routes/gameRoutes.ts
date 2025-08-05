import { Router } from "express";
import { GameController } from "../controllers/gameController";

export function createGameRoutes(gameController: GameController): Router {
  const router = Router();

  router.post('/', (req, res) => gameController.createGame(req, res));
  router.post('/:gameId', (req, res) => gameController.joinGame(req, res));
  router.post('/is-player-in-game', (req, res) => gameController.isPlayerInGame(req, res));

  return router;
}