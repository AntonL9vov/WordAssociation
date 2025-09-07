import { Server } from "socket.io";
import { Game } from "../types/game";

export class SocketEmitterService {
  private io: Server | null = null;

  setSocketInstance(io: Server) {
    this.io = io;
  }

  // Emit to all players in a game room when players are updated
  emitPlayersUpdated(game: Game) {
    if (!this.io) {
      console.warn('⚠️ Socket.IO instance not available for emitting');
      return;
    }

    const room = `game:${game.id}`;
    console.log('📡 Emitting game:players:updated to room:', room, 'with', game.players.length, 'players');
    this.io.to(room).emit('game:players:updated', game);
  }

  // Emit game started event
  emitGameStarted(game: Game) {
    if (!this.io) {
      console.warn('⚠️ Socket.IO instance not available for emitting');
      return;
    }

    const room = `game:${game.id}`;
    console.log('📡 Emitting game:started to room:', room);
    this.io.to(room).emit('game:started', game);
  }

  // Emit game finished event
  emitGameFinished(game: Game) {
    if (!this.io) {
      console.warn('⚠️ Socket.IO instance not available for emitting');
      return;
    }

    const room = `game:${game.id}`;
    console.log('📡 Emitting game:finished to room:', room);
    this.io.to(room).emit('game:finished', game);
  }

  // Emit game restarted event
  emitGameRestarted(game: Game) {
    if (!this.io) {
      console.warn('⚠️ Socket.IO instance not available for emitting');
      return;
    }

    const room = `game:${game.id}`;
    console.log('📡 Emitting game:restart to room:', room);
    this.io.to(room).emit('game:restart', game);
  }
}