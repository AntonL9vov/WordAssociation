import { userService } from "@/shared/api/user-service";

export const playerConnect = async (name: string) => {
  const user = await userService.createUser(name);

  return user;
};
