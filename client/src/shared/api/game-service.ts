import { API_CONFIG } from "../config/api";
import { Game, User } from "../lib/types";
import { io, Socket } from "socket.io-client";

export type GameServiceListener = (data: any) => void;

export type GameServiceListeners = Record<string, ((...args: any[]) => void)[]>;

export type GameCreatedEvent = {
  game: Game;
};

export class GameService {
  private socketService: Socket;
  private game: Game | null = null;
  private user: User | null = null;

  private listeners: GameServiceListeners;

  constructor() {
    this.socketService = io(API_CONFIG.wsUrl);
    this.listeners = {};
  }

  addListener(event: string, listener: (...args: any[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(listener);

    this.socketService.off(event);
    this.socketService.on(event, (data) => {
      this.listeners[event].forEach((listener) => listener(data));
    });

    console.log("listeners", this.listeners);

    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (l) => l !== listener
      );
      if (this.listeners[event].length === 0) {
        this.socketService.off(event);
      }
    };
  }

  emit(event: string, data: any) {
    console.log("emit", event, data);
    this.socketService.emit(event, data);
  }

  getGame(): Game | null {
    return this.game;
  }

  getUser(): User | null {
    return this.user;
  }

  setUser(user: User | null) {
    this.user = user;
  }
}

export const gameService = new GameService();
