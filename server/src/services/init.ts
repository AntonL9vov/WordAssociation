import { UsersStorage } from "../storages/usersStorage";
import { UsersService } from "./usersService";

const usersStorage = new UsersStorage();
export const usersService = new UsersService(usersStorage);
