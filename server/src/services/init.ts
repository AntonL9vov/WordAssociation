import { GamesStorage } from "../storages/gamesStorage";
import { UsersStorage } from "../storages/usersStorage";
import { GameService } from "./gameService";
import { UsersService } from "./usersService";

export const createServices = () => {
  const usersStorage = new UsersStorage();
  const usersService = new UsersService(usersStorage);

  const gamesStorage = new GamesStorage();
  const gamesService = new GameService(gamesStorage, usersService);

  return { usersService, gamesService };
};
