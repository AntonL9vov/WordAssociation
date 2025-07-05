import { Socket } from "socket.io";

export interface BaseSocket {
    initSocket(socket: Socket): void;
    initEvents(): void;
}
