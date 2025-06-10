import { API_CONFIG } from "../config/api";
import { io, Socket } from "socket.io-client";

export class SocketService {
  private socket: Socket;
  constructor() {
    console.log(API_CONFIG.wsUrl);
    this.socket = io(API_CONFIG.wsUrl);
  }

  emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  on(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }
}
