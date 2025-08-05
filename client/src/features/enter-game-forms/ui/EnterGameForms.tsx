import { Button } from "@mui/material";
import "./style.css";
import { useState } from "react";
import { JoinGame } from "@/features";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export type CurrentStep = "create" | "join" | null;

export type EnterGameFormsProps = {
  onJoinGame: (gameId?: string) => void;
};

export const EnterGameForms = ({ onJoinGame }: EnterGameFormsProps) => {
  const [currentStep, setCurrentStep] = useState<CurrentStep>(null);

  const handleCreateGame = () => {
    onJoinGame();
  };

  const handleJoinGame = (gameId?: string) => {
    onJoinGame(gameId);
  };

  return (
    <div className="enter-game-forms">
      {currentStep === null && (
        <>
          <Button
            onClick={() => handleCreateGame()}
            className="enter-game__button"
            variant="contained"
          >
            Create game
          </Button>
          <Button
            onClick={() => setCurrentStep("join")}
            className="enter-game__button"
            variant="contained"
          >
            Join game
          </Button>
        </>
      )}
      {(currentStep === "create" || currentStep === "join") && (
        <div className="enter-game__content">
          <Button
            onClick={() => setCurrentStep(null)}
            className="enter-game__button-back"
            size="small"
            variant="outlined"
          >
            <ArrowBackIcon />
          </Button>
          <div className="enter-game__content-form">
            {currentStep === "join" && <JoinGame onJoinGame={handleJoinGame} />}
          </div>
        </div>
      )}
    </div>
  );
};
