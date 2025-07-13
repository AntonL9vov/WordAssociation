"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const game = new base_1.BaseGame();
// Запускаем REST API сервер на порту 3001
game.startApiServer(3001);
// Socket.IO сервер остается на порту 3000 (или как настроено в BaseSocket)
