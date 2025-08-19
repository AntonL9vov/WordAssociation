import { GameRound } from "@/entities/game-round";
import { useRef, useEffect } from "react";
import "./style.css";
import { useGameStore } from "@/shared/stores/game-store";
import { onGameRoundFinished } from "../api/listeners";
import { useSocketStore } from "@/shared/stores/socket-store";

export const MessengerHistory = () => {
  const historyRef = useRef<HTMLDivElement>(null);
  const socket = useSocketStore((state) => state.socket);
  const setGame = useGameStore((state) => state.setGame);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const cleanup = onGameRoundFinished(setGame, socket);

    return () => {
      cleanup();
    };
  }, [socket]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, []);

  const history = useGameStore((state) => state.game?.rounds || []);

  return (
    <div
      className="messenger-history"
      ref={historyRef}
      data-testid="messenger-history"
    >
      {history.map((round) => (
        <GameRound key={round.id} messages={round.words} />
      ))}
    </div>
  );
};
