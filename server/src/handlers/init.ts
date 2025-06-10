import { Server } from "socket.io";

export type Handler = {
  event: string;
  handler: (...args: any[]) => void;
};

export const init = (io: Server, handlers: Handler[]) => {
  io.on("connection", (socket) => {
    console.log("connection event received");
    console.log("A user connected:", socket.id);

    handlers.forEach((handler) => {
      socket.on(handler.event, handler.handler);
    });
  });
};
