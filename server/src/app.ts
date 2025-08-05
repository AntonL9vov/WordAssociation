import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";
import { UsersService } from "./services/usersService";
import { GameService } from "./services/gameService";
import { UsersControllerV2 } from "./controllers/usersController.v2";
import { GameControllerV2 } from "./controllers/gameController.v2";
import { HealthController } from "./controllers/healthController";
import "reflect-metadata";

export function createApiServerV2(
  usersService: UsersService,
  gameService: GameService
): express.Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Serve Swagger documentation
  try {
    const swaggerDocument = require("../public/swagger.json");
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "Word Association Game API",
      swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: true,
        filter: true,
        syntaxHighlight: {
          activate: true,
          theme: "agate"
        }
      }
    }));
  } catch (error) {
    console.warn("Swagger documentation not available. Run 'npm run swagger:generate' first.");
  }

  // Initialize controllers with services
  const container = {
    get: (identifier: string) => {
      switch (identifier) {
        case "UsersService":
          return usersService;
        case "GameService":
          return gameService;
        default:
          throw new Error(`Service ${identifier} not found`);
      }
    }
  };

  // Register auto-generated routes from tsoa
  RegisterRoutes(app);

  // Serve unified documentation homepage
  app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./public" }, (err) => {
      if (err) {
        res.redirect("/docs");
      }
    });
  });

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Not found",
      message: `Route ${req.method} ${req.originalUrl} not found`,
      documentation: "Visit /docs for API documentation"
    });
  });

  // Error handler for tsoa validation errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.status === 422) {
      res.status(422).json({
        error: "Validation failed",
        message: "Request validation failed",
        details: err.fields || err.message
      });
      return;
    }

    if (err.status) {
      res.status(err.status).json({
        error: err.message || "Error",
        message: err.message || "An error occurred"
      });
      return;
    }

    res.status(500).json({
      error: "Internal server error",
      message: err.message || "Unknown error"
    });
  });

  return app;
}