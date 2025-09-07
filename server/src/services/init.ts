import { GamesStorage } from "../storages/gamesStorage";
import { UsersStorage } from "../storages/usersStorage";
import { PostgresGamesStorage } from "../storages/postgres/gamesStorage";
import { PostgresUsersStorage } from "../storages/postgres/usersStorage";
import { GameService } from "./gameService";
import { UsersService } from "./usersService";
import { getStorageConfig } from "../config/storage";
import { DatabaseConnection } from "../config/database";
import type { GamesStorage as IGamesStorage } from "../types/game";
import type { UsersStorage as IUsersStorage } from "../types/users";

export const createServices = async () => {
  const storageConfig = getStorageConfig();
  
  let usersStorage: IUsersStorage;
  let gamesStorage: IGamesStorage;
  
  if (storageConfig.type === 'postgres') {
    // Test database connection first
    const dbConnection = DatabaseConnection.getInstance();
    const isConnected = await dbConnection.testConnection();
    
    if (!isConnected) {
      throw new Error('Failed to connect to PostgreSQL database');
    }
    
    console.log('Using PostgreSQL storage');
    usersStorage = new PostgresUsersStorage();
    gamesStorage = new PostgresGamesStorage();
  } else {
    console.log('Using in-memory storage');
    usersStorage = new UsersStorage();
    gamesStorage = new GamesStorage();
  }
  
  const usersService = new UsersService(usersStorage);
  const gamesService = new GameService(gamesStorage, usersService);

  return { usersService, gamesService };
};
