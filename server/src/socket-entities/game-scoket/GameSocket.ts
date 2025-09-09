import { Socket } from "socket.io";
import { BaseSocket } from "../base-socket-type";
import { GameService } from "../../types/game";
import { SocketEvents } from "../../types/base";
import { gameSocketEvents } from "./game-socket-events";

export class GameSocket implements BaseSocket {
  private gameService: GameService;
  private gameSocketEvents: Record<string, SocketEvents>;
  private socket: Socket | undefined;

  constructor(gameService: GameService) {
    this.gameService = gameService;
    this.gameSocketEvents = gameSocketEvents;
  }

  initSocket(socket: Socket) {
    this.socket = socket;
    this.initEvents();
  }

  initEvents() {
    Object.values(this.gameSocketEvents).forEach((value) => {
      if (!value.handler) return;

      Object.values(value.handler).forEach((handler) => {
        this.socket?.on(handler.event, (...data) => {
          handler.callback(this.socket!, this.gameService, ...data);
        });
      });
    });
  }
}
