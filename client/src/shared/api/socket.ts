import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "../config/api";

export class SocketService {
  private socket: Socket;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void>;
  private gameId: string;

  constructor(gameId: string) {
    this.gameId = gameId;
    this.socket = io(API_CONFIG.socketUrl, {
      query: {
        gameId,
      },
      transports: ['websocket', 'polling'], // Ensure fallback
      timeout: 5000,
    });
    
    // Create a promise that resolves when connected
    this.connectionPromise = new Promise((resolve) => {
      this.socket.on("connect", () => {
        console.log("✅ Connected to server, socket ID:", this.socket.id);
        this.isConnected = true;
        resolve();
      });
    });
    
    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      this.isConnected = false;
    });
    
    this.socket.on("connect_error", (err) => {
      console.log("🔴 Socket connect_error", err);
      this.isConnected = false;
    });
    
    // Log all events for debugging
    this.socket.onAny((event: string, ...args: any[]) => {
      console.log("🔥 Socket event received:", event, args);
    });
  }

  // Wait for connection before setting up listeners
  async waitForConnection(): Promise<void> {
    if (this.isConnected) {
      return Promise.resolve();
    }
    await this.connectionPromise;
    
    // Auto-join room after connection is established
    await this.joinRoom();
  }

  // Join the game room
  private async joinRoom(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      // Get user from auth context - we'll need to pass this
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        reject(new Error('No user found in localStorage'));
        return;
      }

      // Listen for successful room join
      this.socket.once('game:room:joined', () => {
        console.log('✅ Successfully joined game room');
        resolve();
      });

      // Listen for error
      this.socket.once('game:room:join:error', (error: string) => {
        console.error('❌ Failed to join room:', error);
        reject(new Error(error));
      });

      // Emit join room event
      this.socket.emit('game:join:room', this.gameId, user.id);
      console.log('📤 Emitted game:join:room for gameId:', this.gameId, 'playerId:', user.id);
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
      console.warn('⚠️ Attempted to emit while disconnected:', event);
    }
  }

  send(event: string, data: any) {
    if (this.connected) {
      this.socket.send(JSON.stringify({ event, data }));
    } else {
      console.warn('⚠️ Attempted to send while disconnected:', event);
    }
  }

  // Clean disconnect
  disconnect() {
    this.socket.disconnect();
    this.isConnected = false;
  }
}
