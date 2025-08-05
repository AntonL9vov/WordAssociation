import "./style.css";
import { EnterGameForms } from "@/features";
import { gameService } from "@/shared/api/game-service";
import { createGame, joinGame } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Game } from "@/shared/lib/types";

export const EnterGame = () => {
  const navigate = useNavigate();

  const handleJoinGame = async (gameId?: string) => {
    const id = gameService.getUser()!.id;
    let response: Game | null = null;

    if (gameId) {
      response = await joinGame(gameId, id);
    } else {
      response = await createGame(id);
    }

    if (response) {
      gameService.setGame(response);
      navigate("/game");
    }
  };

  return <EnterGameForms onJoinGame={handleJoinGame} />;
};
