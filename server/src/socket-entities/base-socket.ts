import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import { BaseSocket as IBaseSocket } from "./base-socket-type";

export class BaseSocket {
  private io: Server;
  private httpServer: http.Server;
  socket: Socket | undefined;
  private sockets: IBaseSocket[] = [];

  constructor(sockets: IBaseSocket[], httpServer: http.Server) {
    this.httpServer = httpServer;
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.sockets = sockets;
    this.initSocket();
  }

  // Get the io instance for emitting to all clients or rooms
  getIO(): Server {
    return this.io;
  }

  initSocket() {
    this.io.on("connection", (socket) => {
      console.log("Socket connection received:", socket.id);

      // Store reference to current socket for compatibility
      this.socket = socket as Socket;
      this.socket.join(`game:${socket.handshake.query.gameId as string}`);
      
      // Initialize socket handlers for each socket handler
      this.initSockets(socket);
    });
  }

  initSockets(socket: Socket) {
    this.sockets.forEach((socketHandler) => {
      socketHandler.initSocket(socket);
    });
  }
}
