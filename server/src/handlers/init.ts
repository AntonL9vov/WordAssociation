import { InitConfig } from "../types/base";

export const initHandlers = ({ io, handlers }: InitConfig) => {
  io.on("connection", (socket) => {
    console.log("connection event received");

    handlers.forEach((handler) => {
      socket.on(handler.event, (...args: unknown[]) =>
        handler.handler(socket, ...args)
      );
    });
  });
};
