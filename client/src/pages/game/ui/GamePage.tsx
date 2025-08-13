import { GameMessenger } from "@/widgets";
import "./style.css";
import { useGameStore } from "@/shared/stores/game-store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StartGame } from "@/widgets/start-game/ui/StartGame";

export const GamePage = () => {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);

  const gameStatus = useGameStore((state) => state.game?.status);

  useEffect(() => {
    if (!game) {
      navigate("/");
      return;
    }
    console.log("gameStatus", gameStatus, game);
  }, [game]);

  return (
    <div className="game-page">
      {gameStatus === "created" && <StartGame />}
      {gameStatus === "started" && <GameMessenger />}
      {gameStatus === "finished" && <GameMessenger />}
    </div>
  );
};
