import { Server, Socket } from "socket.io";
import { GameServiceEmitters } from "./game";

export interface Handler {
  event: string;
  handler: (socket: Socket, ...args: any[]) => void;
}

export interface InitConfig {
  io: Server;
  handlers: Handler[];
  emitters: GameServiceEmitters;
}

export interface SocketEmitEvent {
  event: string;
  callback: (socket: Socket, ...args: any[]) => unknown;
}

export interface SocketHandlerEvent {
  event: string;
  callback: (...args: any[]) => unknown;
}

export type SocketEvents = {
  handler: Record<string, SocketHandlerEvent>;
  emit: Record<string, SocketEmitEvent>;
};
