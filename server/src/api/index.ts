import express from "express";
import cors from "cors";
import { createUsersRoutes } from "../routes/usersRoutes";
import { UsersController } from "../controllers/usersController";
import { UsersService } from "../services/usersService";
import { createGameRoutes } from "../routes/gameRouets";
import { GameController } from "../controllers/gameController";
import { GameService } from "../services/gameService";

export function createApiServer(
  usersService: UsersService,
  gameService: GameService
): express.Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Controllers
  const usersController = new UsersController(usersService);
  const gameController = new GameController(gameService);

  // Routes
  app.use("/api/users", createUsersRoutes(usersController));
  app.use("/api/games", createGameRoutes(gameController));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Not found",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  return app;
}
