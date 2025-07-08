import "./style.css";
import { EnterGameForms } from "@/features";
import {
  createGame,
  initCreateGameListener,
  initJoinGameListener,
  joinGame,
} from "../api/socket-hooks";
import { useEffect } from "react";
import { gameService } from "@/shared/api/game-service";

export const EnterGame = () => {
  const clearJoinGameListeners = initJoinGameListener();
  const clearCreateGameListeners = initCreateGameListener();

  const handleJoinGame = (gameId?: string) => {
    const name = gameService.getUser()!.name;

    if (gameId) {
      joinGame(gameId, name);
    } else {
      createGame(name);
    }
  };

  useEffect(() => {
    return () => {
      clearJoinGameListeners();
      clearCreateGameListeners();
    };
  }, []);

  return <EnterGameForms onJoinGame={handleJoinGame} />;
};
