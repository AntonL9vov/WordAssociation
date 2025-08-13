import { Button, TextField } from "@mui/material";
import "./style.css";

interface EnterGameFormBaseProps {
  onJoinGame: (gameId: string) => void;
  buttonLabel: string;
  buttonDisabled?: boolean;
}

interface EnterGameFormWithGameIdProps extends EnterGameFormBaseProps {
  withGameId: true;
  gameId: string;
  onGameIdChange: (gameId: string) => void;
}

interface EnterGameFormWithoutGameIdProps extends EnterGameFormBaseProps {
  withGameId: false;
  gameId?: never;
  onGameIdChange?: never;
}

type EnterGameFormProps =
  | EnterGameFormWithGameIdProps
  | EnterGameFormWithoutGameIdProps;

export const EnterGameForm = ({
  gameId,
  onGameIdChange,
  onJoinGame,
  buttonLabel,
  withGameId,
  buttonDisabled,
}: EnterGameFormProps) => {
  const handleJoinGame = (gameId: string | undefined) => {
    if (gameId) {
      onJoinGame(gameId);
    }
  };

  return (
    <div className="enter-game-form">
      {withGameId && (
        <TextField
          label="Game ID"
          placeholder="Game ID"
          value={gameId}
          onChange={(e) => onGameIdChange(e.target.value)}
        />
      )}
      <Button
        disabled={!gameId || buttonDisabled}
        variant="contained"
        onClick={() => handleJoinGame(gameId)}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};
