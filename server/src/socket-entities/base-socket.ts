import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import { BaseSocket as IBaseSocket } from "./base-socket-type";

export class BaseSocket {
  private app: express.Application;
  private io: Server;
  private httpServer: http.Server;
  private port: number;
  private socket: Socket | undefined;
  private sockets: IBaseSocket[] = [];

  constructor(sockets: IBaseSocket[], port: number) {
    this.port = port;
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

    // Serve AsyncAPI documentation
    this.app.get('/docs', (req, res) => {
      res.sendFile('asyncapi.html', { root: './public' }, (err) => {
        if (err) {
          res.status(404).send(`
            <h1>AsyncAPI Documentation Not Found</h1>
            <p>Run <code>npm run asyncapi:generate</code> to generate WebSocket documentation.</p>
            <p><a href="http://localhost:3001/docs">View HTTP API Documentation</a></p>
          `);
        }
      });
    });

    // Serve AsyncAPI JSON spec
    this.app.get('/asyncapi.json', (req, res) => {
      res.sendFile('asyncapi.json', { root: './public' }, (err) => {
        if (err) {
          res.status(404).json({
            error: 'AsyncAPI specification not found',
            message: 'Run npm run asyncapi:generate to generate WebSocket documentation'
          });
        }
      });
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        service: 'WebSocket Server',
        timestamp: new Date().toISOString(),
        connections: this.io.engine.clientsCount
      });
    });

    // Redirect root to docs
    this.app.get('/', (req, res) => {
      res.redirect('/docs');
    });

    this.httpServer.listen(this.port, () => {
      console.log(`🚀 Server is running on port ${this.port}`);
      console.log(`📚 Documentation available at:`);
      console.log(`   • WebSocket API: http://localhost:${this.port}/docs`);
      console.log(`   • HTTP API: http://localhost:3001/docs`);
      console.log(`   • AsyncAPI JSON: http://localhost:${this.port}/asyncapi.json`);
      console.log(`🔌 WebSocket server: ws://localhost:${this.port}`);
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
}
