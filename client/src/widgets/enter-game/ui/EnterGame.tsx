import "./style.css";
import { EnterGameForms } from "@/features";
import { gameService } from "@/shared/api/game-service";
import { createGame, joinGame } from "../api/api";

export const EnterGame = () => {


  const handleJoinGame = (gameId?: string) => {
    const id = gameService.getUser()!.id;

    if (gameId) {
      joinGame(gameId, id);
    } else {
      createGame(id);
    }
  };

  return <EnterGameForms onJoinGame={handleJoinGame} />;
};
