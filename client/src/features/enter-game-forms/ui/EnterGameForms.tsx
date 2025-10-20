import React, { useState } from "react";
import { JoinGame } from "@/features";
import { HomeHeader } from "@/entities/home-header";
import { GameSelectionActions } from "@/features/game-selection";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Card, Container } from "@/shared/ui";
import { Fade } from "@mui/material";
import { useTranslation } from "react-i18next";
import { JoinGameHeader } from "./JoinGameHeader";
import { ResponsiveContainer } from "./ResponsiveContainer";

export type CurrentStep = "join" | null;

export type EnterGameFormsProps = {
  onJoinGame: (gameId?: string) => void;
  joinError: string | null;
  onClearJoinError: () => void;
};

export const EnterGameForms: React.FC<EnterGameFormsProps> = ({
  onJoinGame,
  joinError,
  onClearJoinError,
}) => {
  const [currentStep, setCurrentStep] = useState<CurrentStep>(null);
  const { isMobile } = useBreakpoints();
  const { t } = useTranslation();

  const handleCreateGame = () => {
    onJoinGame();
  };

  const handleJoinGame = (gameId?: string) => {
    onJoinGame(gameId);
  };

  return (
    <ResponsiveContainer isMobile={isMobile}>
      {currentStep === null && (
        <Fade in timeout={600}>
          <Container
            maxWidth={isMobile ? "sm" : "md"}
            sx={{ width: "100%", maxWidth: isMobile ? "90%" : "100%" }}
          >
            {!isMobile && <HomeHeader />}
            <GameSelectionActions
              onCreateGame={handleCreateGame}
              onJoinGame={() => {
                onClearJoinError();
                setCurrentStep("join");
              }}
            />
          </Container>
        </Fade>
      )}

      {currentStep === "join" && (
        <Fade in timeout={600}>
          <Container
            maxWidth="xs"
            sx={{ width: "100%", maxWidth: isMobile ? "95%" : "100%" }}
          >
            <Card>
              <JoinGameHeader
                title={t("game.joinGame")}
                onBack={() => {
                  onClearJoinError?.();
                  setCurrentStep(null);
                }}
              />
              <JoinGame onJoinGame={handleJoinGame} joinError={joinError} />
            </Card>
          </Container>
        </Fade>
      )}
    </ResponsiveContainer>
  );
};
