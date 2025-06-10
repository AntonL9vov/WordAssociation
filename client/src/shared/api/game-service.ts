import { Game } from "../lib/types";
import { SocketService } from "./socket";

export type GameServiceListener = (data: any) => void;

export type GameServiceEvent =
  | "game-created"
  | "game-joined"
  | "player-joined"
  | "player-left"
  | "word-submitted"
  | "round-started"
  | "game-ended"
  | "user-connected";

export type GameServiceListeners = Record<
  GameServiceEvent,
  GameServiceListener[]
>;

export type GameCreatedEvent = {
  game: Game;
};

export class GameService {
  private socketService: SocketService;
  private game: Game | null = null;
  private userId: string | null = null;

  listeners: GameServiceListeners = {
    "game-created": [(data: GameCreatedEvent) => (this.game = data.game)],
    "game-joined": [(data: GameCreatedEvent) => (this.game = data.game)],
    "player-joined": [],
    "player-left": [],
    "word-submitted": [],
    "round-started": [],
    "game-ended": [],
    "user-connected": [(data: string) => this.userId = data],
  };

  constructor() {
    this.socketService = new SocketService();
    this.connect();
    this.initListeners();
  }

  connect() {
    this.socketService.emit("user-connect")
  }

  createGame(playerName: string) {
    console.log("createGame");
    this.socketService.emit("create-game", { playerName });
  }

  joinGame(gameId: string, playerName: string) {
    console.log("joinGame1", gameId, playerName);
    this.socketService.emit("join-game", { gameId, playerName });
  }

  initListeners() {
    Object.entries(this.listeners).forEach(([event, listeners]) => {
      this.socketService.on(event, (data) => {
        console.log(event, data);
        listeners.forEach((listener) => listener(data));
      });
    });
  }

  getGame(): Game | null {
    return this.game;
  }

  getUserId(): string | null {
    return this.userId;
  }
}

export const gameService = new GameService();
