import "./style.css";
import { EnterGameForms } from "@/features";
import { gameService } from "@shared/api/game-service";

export const EnterGame = () => {
  const handleJoinGame = (name: string, gameId?: string) => {
    if (gameId) {
      console.log("joinGame", gameId, name);
      gameService.joinGame(gameId, name);
    } else {
      gameService.createGame(name);
    }
  };

  return <EnterGameForms onJoinGame={handleJoinGame} />;
};
