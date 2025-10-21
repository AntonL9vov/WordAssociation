import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "../config/api";

export class SocketService {
  private socket: Socket;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void>;
  private gameId: string;
  private hasJoinedRoom: boolean = false;
  private userId: string;

  constructor(gameId: string, userId: string) {
    this.gameId = gameId;
    this.userId = userId;

    // Socket.IO configuration based on environment
    const socketConfig: any = {
      query: {
        gameId,
      },
      transports: ["websocket", "polling"], // Ensure fallback
      timeout: 5000,
    };

    this.socket = io(API_CONFIG.socketUrl, socketConfig);

    // Create a promise that resolves when connected
    this.connectionPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Socket connection timeout"));
      }, 5000);

      this.socket.once("connect", () => {
        this.isConnected = true;
        clearTimeout(timeout);
        resolve();
      });

      this.socket.once("connect_error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });

    this.socket.on("connect_error", () => {
      this.isConnected = false;
    });

    // // Log all events for debugging
    // this.socket.onAny((event: string, ...args: any[]) => {
    //   console.log("🔥 Socket event received:", event, args);
    // });
  }

  // Wait for connection before setting up listeners
  async waitForConnection(): Promise<void> {
    if (this.isConnected && this.hasJoinedRoom) return;
    await this.connectionPromise;
    if (!this.hasJoinedRoom) {
      await this.joinRoom();
      this.hasJoinedRoom = true;
    }
  }

  // Join the game room
  private async joinRoom(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      if (!this.userId) {
        reject(new Error("No user id found"));
        return;
      }

      // Listen for successful room join
      this.socket.once("game:room:joined", () => {
        resolve();
      });

      // Listen for error
      this.socket.once("game:room:join:error", (error: string) => {
        console.error("❌ Failed to join room:", error);
        reject(new Error(error));
      });

      // Emit join room event
      this.socket.emit("game:join:room", this.gameId, this.userId);
    });
  }

  // Check if socket is connected
  get connected(): boolean {
    return this.isConnected && this.socket.connected;
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  off(event: string, callback: (data: any) => void) {
    this.socket.off(event, callback);
  }

  emit(event: string, ...args: any[]) {
    if (this.connected) {
      this.socket.emit(event, ...args);
    } else {
      console.warn("⚠️ Attempted to emit while disconnected:", event);
    }
  }

  send(event: string, data: any) {
    if (this.connected) {
      this.socket.send(JSON.stringify({ event, data }));
    } else {
      console.warn("⚠️ Attempted to send while disconnected:", event);
    }
  }

  // Clean disconnect
  disconnect() {
    this.socket.disconnect();
    this.isConnected = false;
    this.socket.removeAllListeners();
    this.hasJoinedRoom = false;
  }
}
