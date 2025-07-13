import { BaseGame } from "./base";

const game = new BaseGame();

// Запускаем REST API сервер на порту 3001
game.startApiServer(3001);

// Socket.IO сервер остается на порту 3000 (или как настроено в BaseSocket)