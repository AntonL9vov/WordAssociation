import { gameService } from "@shared/api/game-service";

export const joinGame = (gameId: string, name: string) => {
  gameService.emit("game:join", [gameId, name]);
};

export const createGame = (name: string) => {
  gameService.emit("game:create", { name });
};

export const initJoinGameListener = () => {
  const listener = (data: any) => {
    console.log("game:joined", data);
  };

  const errorListener = (data: any) => {
    console.log("game:joined:error", data);
  };

  const clearSuccessListener = gameService.addListener("game:joined", listener);
  const clearErrorListener = gameService.addListener(
    "game:joined:error",
    errorListener
  );

  return () => {
    clearSuccessListener();
    clearErrorListener();
  };
};

export const initCreateGameListener = () => {
  const listener = (data: any) => {
    console.log("game:created", data);
  };

  const errorListener = (data: any) => {
    console.log("game:created:error", data);
  };

  const clearSuccessListener = gameService.addListener(
    "game:created",
    listener
  );
  const clearErrorListener = gameService.addListener(
    "game:created:error",
    errorListener
  );

  return () => {
    clearSuccessListener();
    clearErrorListener();
  };
};
