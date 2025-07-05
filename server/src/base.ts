import { UsersService } from "./services/usersService";
import { BaseSocket } from "./socket-entities/base-socket";
import { UsersStorage } from "./storages/usersStorage";
import { UsersSocket } from "./socket-entities/users-socket/UsersSocket";
import { GameSocket } from "./socket-entities/game-scoket/GameSocket";
import { GamesStorage } from "./storages/gamesStorage";
import { GameService } from "./services/gameService";
import { User } from "./types/users";
import { Game } from "./types/game";

const initialUsersState: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
];

const initialGamesState: Record<string, Game> = {
  "1": {
    id: "1",
    rounds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    startWord: "",
    isFinished: false,
    players: [
      {
        id: "1",
        name: "John Doe",
      },
      {
        id: "2",
        name: "Jane Doe",
      },
    ],
    isStarted: false,
  },
};

export class BaseGame {
  private userStorage: UsersStorage;
  private usersService: UsersService;
  private userSocket: UsersSocket;

  private gameStorage: GamesStorage;
  private gameService: GameService;
  private gameSocket: GameSocket;

  private baseSocket: BaseSocket;

  constructor() {
    this.userStorage = new UsersStorage(initialUsersState);
    this.usersService = new UsersService(this.userStorage);
    this.userSocket = new UsersSocket(this.usersService);

    this.gameStorage = new GamesStorage(initialGamesState);
    this.gameService = new GameService(this.gameStorage, this.usersService);
    this.gameSocket = new GameSocket(this.gameService);

    this.baseSocket = new BaseSocket([this.userSocket, this.gameSocket]);
  }
}
