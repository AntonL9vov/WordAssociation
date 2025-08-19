import { GameMessenger } from "@/widgets";
import "./style.css";
import { useGameStore } from "@/shared/stores/game-store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StartGame } from "@/widgets/start-game/ui/StartGame";
import {
  onGameFinished,
  onGameStarted,
  onRoomPlayersChanged,
} from "../api/gameListeners";
import { useSocketStore } from "@/shared/stores/socket-store";
import { SocketService } from "@/shared/api/socket";

export const GamePage = () => {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);

  const gameStatus = useGameStore((state) => state.game?.status);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!game) {
      navigate("/");
      return;
    }

    if (!socket) {
      const newSocket = new SocketService(game.id);
      useSocketStore.setState({ socket: newSocket });
    }
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const cleanupPlayersChanged = onRoomPlayersChanged(setGame, socket);
    const cleanupGameStarted = onGameStarted(setGame, socket);
    const cleanupGameFinished = onGameFinished(setGame, socket);

    return () => {
      cleanupPlayersChanged();
      cleanupGameStarted();
      cleanupGameFinished();
    };
  }, [socket]);

  useEffect(() => {
    if (!game) {
      navigate("/");
      return;
    }
  }, [game]);

  return (
    <div className="game-page">
      {gameStatus === "created" && <StartGame />}
      {gameStatus === "started" && <GameMessenger />}
      {gameStatus === "finished" && <GameMessenger />}
    </div>
  );
};
