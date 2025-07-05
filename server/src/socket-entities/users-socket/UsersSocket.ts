import type { UsersService as IUsersService } from "../../types/users";
import { SocketEvents } from "../../types/base";
import { userSocketEvents } from "./user-socket-events";
import { Socket } from "socket.io";
import { BaseSocket } from "../base-socket-type";

export class UsersSocket implements BaseSocket {
  private usersService: IUsersService;
  private userSocketEvents: Record<string, SocketEvents>;
  private socket: Socket | undefined;

  constructor(userService: IUsersService) {
    this.usersService = userService;
    this.userSocketEvents = userSocketEvents;
  }

  initSocket(socket: Socket) {
    this.socket = socket;
    this.initEvents();
  }

  initEvents() {
    Object.values(this.userSocketEvents).forEach((value) => {
      if (!value.handler) return;

      Object.values(value.handler).forEach((handler) => {
        this.socket?.on(handler.event, (...data) => {
          handler.callback(this.socket!, this.usersService, ...data);
        });
      });
    });
  }
}
