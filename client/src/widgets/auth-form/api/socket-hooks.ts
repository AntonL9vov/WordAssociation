import { gameService } from "@/shared/api/game-service";
import { User } from "@/shared/lib/types";

export const playerConnect = (name: string) => {
  gameService.emit("user:connect", { name });
};

export const initPlayerConnectListener = (
  callback: (user: User) => void
) => {
  const listener = (data: { user: User }) => {
    callback(data.user);
  };

  const clearListener = gameService.addListener("user:connected", listener);

  return () => {
    clearListener();
  };
};
