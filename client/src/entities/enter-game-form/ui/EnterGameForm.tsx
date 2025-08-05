import { Button, TextField } from "@mui/material";
import "./style.css";

interface EnterGameFormBaseProps {
  onJoinGame: () => void;
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
  const handleJoinGame = () => {
    onJoinGame();
  };

  return (
    <div className="enter-game-form">
      {/* <TextField
        value={playerName}
        label="Player Name"
        placeholder="Player Name"
        onChange={(e) => setPlayerName(e.target.value)}
      /> */}
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
        onClick={() => handleJoinGame()}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};
