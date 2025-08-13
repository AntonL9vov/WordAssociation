import { EnterGameForm } from "@/entities";
import { useState } from "react";

export type JoinGameProps = {
  onJoinGame: (gameId: string) => void;
};

export const JoinGame = ({ onJoinGame }: JoinGameProps) => {
  const [gameId, setGameId] = useState("");

  const handleJoinGame = () => {
    onJoinGame(gameId);
  };

  const handleGameIdChange = (gameId: string) => {
    setGameId(gameId);
  };

  return (
    <div>
      <EnterGameForm
        withGameId={true}
        onJoinGame={handleJoinGame}
        onGameIdChange={handleGameIdChange}
        gameId={gameId}
        buttonLabel="Join game"
        buttonDisabled={!gameId}
      />
    </div>
  );
};
