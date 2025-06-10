import { Button } from "@mui/material";
import "./style.css";
import { useState } from "react";
import { CreateGame } from "@/features";
import { JoinGame } from "@/features";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export type CurrentStep = "create" | "join" | null;

export type EnterGameFormsProps = {
  onJoinGame: (name: string, gameId?: string) => void;
};

export const EnterGameForms = ({ onJoinGame }: EnterGameFormsProps) => {
  const [currentStep, setCurrentStep] = useState<CurrentStep>(null);

  const handleCreateGame = (name: string) => {
    onJoinGame(name);
  };

  const handleJoinGame = (name: string, gameId?: string) => {
    console.log("handleJoinGame", name, gameId);
    onJoinGame(name, gameId);
  };

  return (
    <div className="enter-game">
      {currentStep === null && (
        <>
          <Button
            onClick={() => setCurrentStep("create")}
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
            {currentStep === "create" && (
              <CreateGame onJoinGame={handleCreateGame} />
            )}
            {currentStep === "join" && <JoinGame onJoinGame={handleJoinGame} />}
          </div>
        </div>
      )}
    </div>
  );
};
