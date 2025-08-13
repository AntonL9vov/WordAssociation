import { Router } from "express";
import { GameController } from "../controllers/game.controller";

export function createGameRoutes(gameController: GameController): Router {
  const router = Router();

  router.post("/", (req) => gameController.createGame(req.body));
  router.post("/:gameId/join", (req) =>
    gameController.joinGame(req.params.gameId, req.body)
  );
  router.get("/is-player-in-game/:playerId", (req) =>
    gameController.isPlayerInGame(req.params.playerId)
  );
  router.post("/:gameId/start", (req) =>
    gameController.startGame(req.params.gameId, req.body)
  );
  router.get("/get-random-word", () => gameController.getRandomWord());

  return router;
}
