import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "../config/api";

export class SocketService {
  private socket: Socket;

  constructor(gameId: string) {
    this.socket = io(API_CONFIG.socketUrl, {
      query: {
        gameId,
      },
    });
    this.socket.on("connect", () => {
      console.log("✅ Connected to server, socket ID:", this.socket.id);
    });
    this.socket.on("disconnect", () => console.log("❌ Disconnected from server"));
    this.socket.on("connect_error", (err) => console.log("🔴 Socket connect_error", err));
    
    // Log all events for debugging
    this.socket.onAny((event: string, ...args: any[]) => {
      console.log("🔥 Socket event received:", event, args);
    });
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  off(event: string, callback: (data: any) => void) {
    this.socket.off(event, callback);
  }

  emit(event: string, ...args: any[]) {
    this.socket.emit(event, ...args);
  }

  send(event: string, data: any) {
    this.socket.send(JSON.stringify({ event, data }));
  }
}
