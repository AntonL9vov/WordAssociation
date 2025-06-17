import { Server, Socket } from "socket.io";

export interface Handler {
  event: string;
  handler: (socket: Socket, ...args: any[]) => void;
}

export interface InitConfig {
  io: Server;
  handlers: Handler[];
}
