import { GameMessenger } from "@/widgets";
import "./style.css";
import { gameService } from "@/shared/api/game-service";

export const GamePage = () => {
  const game = gameService.getGame();



  return (
    <div className="game-page">
      <GameMessenger />
    </div>
  );
};
