import "./style.css";
import { EnterGameForms } from "@/features";
import { createGame, joinGame } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Game } from "@/shared/lib/types";
import { useGameStore } from "@/shared/stores/game-store";
import { useAuth } from "@/shared/context/AuthContext";

export const EnterGame = () => {
  const navigate = useNavigate();
  const setGame = useGameStore((state) => state.setGame);
  const user = useAuth();

  const handleJoinGame = async (gameId?: string) => {
    if (!user.user) {
      return;
    }

    const id = user.user.id;
    let response: Game | null = null;

    if (gameId) {
      response = await joinGame(gameId, id);
    } else {
      response = await createGame(id);
    }

    setGame(response);

    navigate("/game");
  };

  return <EnterGameForms onJoinGame={handleJoinGame} />;
};
