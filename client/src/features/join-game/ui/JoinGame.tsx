import { EnterGameForm } from "@/entities";
import { useState } from "react";

export type JoinGameProps = {
  onJoinGame: (name: string, gameId: string) => void;
};

export const JoinGame = ({ onJoinGame }: JoinGameProps) => {
  const [gameId, setGameId] = useState("");

  const handleJoinGame = (name: string) => {
    onJoinGame(name, gameId);
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
