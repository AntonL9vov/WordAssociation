import { useTranslation } from 'react-i18next';
import { EnterGameForm } from "@/entities";
import { Alert } from "@mui/material";
import { useState } from "react";

export type JoinGameProps = {
  onJoinGame: (gameId: string) => void;
  joinError: string | null;
};

export const JoinGame = ({ onJoinGame, joinError }: JoinGameProps) => {
  const { t } = useTranslation();
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
        onJoinGame={handleJoinGame}
        onGameIdChange={handleGameIdChange}
        gameId={gameId}
        buttonLabel={t('game.joinGame')}
        buttonDisabled={!gameId}
      />
      {joinError && (
        <div style={{ marginTop: 8 }}>
          <Alert severity="error" variant="outlined">{joinError}</Alert>
        </div>
      )}
    </div>
  );
};
