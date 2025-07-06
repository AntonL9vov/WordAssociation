import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import { BaseSocket as IBaseSocket } from "./base-socket-type";
import { DocumentationMiddleware } from "../middleware/documentationMiddleware";

export class BaseSocket {
  private app: express.Application;
  private io: Server;
  private httpServer: http.Server;
  private port: number = Number(process.env.PORT) || 3000;
  private socket: Socket | undefined;
  private sockets: IBaseSocket[] = [];

  constructor(sockets: IBaseSocket[]) {
    this.app = express();

    this.httpServer = http.createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.sockets = sockets;

    this.initServer();
    this.initSocket();
  }

  initServer() {
    this.app.use(cors());
    this.app.use(express.json());

    this.httpServer.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
      console.log(`Documentation available at: http://localhost:${this.port}/docs`);
      console.log(`API docs JSON: http://localhost:${this.port}/api/docs`);
    });
  }

  initSocket() {
    this.io.on("connection", (socket) => {
      console.log("connection event received");

      this.socket = socket as Socket;
      this.initSockets();
    });
  }

  initSockets() {
    if (!this.socket) return;
    this.sockets.forEach((socket) => {
      socket.initSocket(this.socket as Socket);
    });
  }

  /**
   * Настраивает документацию в Express приложении
   */
  setupDocumentation(docMiddleware: DocumentationMiddleware): void {
    docMiddleware.setupRoutes(this.app);
  }
}
