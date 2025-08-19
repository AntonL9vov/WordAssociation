import { UsersService } from "./services/usersService";
import { BaseSocket } from "./socket-entities/base-socket";
import { UsersStorage } from "./storages/usersStorage";
import { UsersSocket } from "./socket-entities/users-socket/UsersSocket";
import { GameSocket } from "./socket-entities/game-scoket/GameSocket";
import { GamesStorage } from "./storages/gamesStorage";
import { GameService } from "./services/gameService";
import { User } from "./types/users";
import { Game } from "./types/game";
import { createApiServerV2 } from "./app";
import { setServices } from "./ioc";
import { generateAsyncAPIDocumentation } from "./scripts/generate-asyncapi";
import { shouldGenerateDocumentation } from "./scripts/check-docs";
import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";

const initialUsersState: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
];

const initialGamesState: Record<string, Game> = {
  "1": {
    id: "1",
    rounds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    startWord: "",
    status: "created",
    players: [
      {
        id: "1",
        name: "John Doe",
      },
      {
        id: "2",
        name: "Jane Doe",
      },
    ],
  },
};

export class BaseGame {
  private userStorage: UsersStorage;
  private usersService: UsersService;
  private userSocket: UsersSocket;

  private gameStorage: GamesStorage;
  private gameService: GameService;
  private gameSocket: GameSocket;

  baseSocket: BaseSocket;

  private apiServer: express.Application;

  constructor(httpPort: number = 3001, socketPort: number = 3000) {
    this.userStorage = new UsersStorage(initialUsersState);
    this.usersService = new UsersService(this.userStorage);
    this.userSocket = new UsersSocket(this.usersService);

    this.gameStorage = new GamesStorage(initialGamesState);
    this.gameService = new GameService(this.gameStorage, this.usersService);
    this.gameSocket = new GameSocket(this.gameService);

    this.baseSocket = new BaseSocket([this.userSocket, this.gameSocket], socketPort);

    // Генерируем AsyncAPI документацию для WebSocket (только в development)
    if (process.env.NODE_ENV !== "production") {
      this.generateAsyncAPIDocumentationOnce();
    }

    // Инициализируем сервисы для IoC контейнера
    setServices({
      usersService: this.usersService,
      gameService: this.gameService,
    });

    // Создаем REST API сервер с автогенерированной документацией
    this.apiServer = createApiServerV2(this.usersService, this.gameService);

    this.startApiServer(httpPort);
  }

  // Добавляем метод для запуска REST API сервера
  public startApiServer(port: number): void {
    this.apiServer.listen(port, () => {
      console.log(`REST API server is running on port ${port}`);
    });
  }

  // Генерируем AsyncAPI документацию для WebSocket (с защитой от повторных вызовов)
  private static documentationGenerated = false;

  private async generateAsyncAPIDocumentationOnce(): Promise<void> {
    // Генерируем только если еще не генерировали в этой сессии
    if (BaseGame.documentationGenerated) {
      console.log(
        "ℹ️  AsyncAPI documentation already generated in this session"
      );
      return;
    }

    // Проверяем, нужно ли генерировать документацию
    if (!shouldGenerateDocumentation()) {
      console.log("ℹ️  Documentation is up to date, skipping generation");
      BaseGame.documentationGenerated = true;
      return;
    }

    try {
      await generateAsyncAPIDocumentation();
      BaseGame.documentationGenerated = true;
    } catch (error) {
      console.warn(
        "⚠️ Failed to generate AsyncAPI documentation:",
        error instanceof Error ? error.message : error
      );
    }
  }
}
