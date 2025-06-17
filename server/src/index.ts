import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { GameService } from "./services/gameService";
import { v4 as uuidv4 } from "uuid";
import { usersService } from "./services/init";
import { getUsersHandlers } from "./handlers/user/create-users-handlers";
import { initHandlers } from "./handlers/init";

const app = express();
const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const usersHandlers = getUsersHandlers(usersService);

const handlers = [...usersHandlers];

initHandlers({ io, handlers });

// // Game service instance
// const gameService = GameService.getInstance();

// // Socket.IO connection handling
// io.on("connection", (socket) => {
//   console.log("connection event received");
//   let userId: string;

//   socket.on("user-connect", () => {
//     userId = uuidv4();
//     console.log("A user connected:", userId);
//     socket.emit("user-connected", userId);
//   });

//   // Create game
//   socket.on("create-game", ({ playerName }: { playerName: string }) => {
//     console.log("create-game event received");
//     const game = gameService.createGame(userId, playerName);
//     socket.join(game.id);
//     socket.emit("game-created", { game });
//   });

//   // Join game
//   socket.on(
//     "join-game",
//     ({ gameId, playerName }: { gameId: string; playerName: string }) => {
//       console.log("game-joined event received", gameId, playerName);
//       try {
//         const game = gameService.joinGame(gameId, userId, playerName);
//         socket.join(gameId);
//         socket.emit("game-joined", { game });
//         io.to(gameId).emit("player-joined", { playerId: userId, playerName });
//       } catch (error) {
//         socket.emit("error", { message: error });
//       }
//     }
//   );

//   // Submit word
//   socket.on("submit-word", (gameId: string, word: string) => {
//     try {
//       gameService.submitWord(gameId, userId, word);
//     } catch (error) {
//       socket.emit("error", { message: error });
//     }
//   });

//   // Game room events
//   socket.on("join-game-room", (gameId: string) => {
//     socket.join(gameId);
//   });

//   socket.on("leave-game-room", (gameId: string) => {
//     socket.leave(gameId);
//     gameService.removePlayer(gameId, userId);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", userId);
//     // Remove player from all rooms
//     Object.keys(io.sockets.adapter.rooms).forEach((room) => {
//       if (room !== userId) {
//         gameService.removePlayer(room, userId);
//       }
//     });
//   });
// });

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
