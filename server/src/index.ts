import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { GameService } from "./services/gameService";

const app = express();
const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Multiplayer Game Server is running");
});

// Game service instance
const gameService = GameService.getInstance();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create game
  socket.on("create-game", () => {
    const gameId = gameService.createGame();
    socket.join(gameId);
    socket.emit("game-created", { gameId });
  });

  // Join game
  socket.on("join-game", (gameId: string, playerName: string) => {
    try {
      const game = gameService.joinGame(gameId, socket.id, playerName);
      socket.join(gameId);
      socket.emit("game-joined", { gameId, game });
      io.to(gameId).emit("player-joined", { playerId: socket.id, playerName });
    } catch (error) {
      socket.emit("error", { message: error });
    }
  });

  // Submit word
  socket.on("submit-word", (gameId: string, word: string) => {
    try {
      gameService.submitWord(gameId, socket.id, word);
    } catch (error) {
      socket.emit("error", { message: error });
    }
  });

  // Game room events
  socket.on("join-game-room", (gameId: string) => {
    socket.join(gameId);
  });

  socket.on("leave-game-room", (gameId: string) => {
    socket.leave(gameId);
    gameService.removePlayer(gameId, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove player from all rooms
    Object.keys(io.sockets.adapter.rooms).forEach((room) => {
      if (room !== socket.id) {
        gameService.removePlayer(room, socket.id);
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
