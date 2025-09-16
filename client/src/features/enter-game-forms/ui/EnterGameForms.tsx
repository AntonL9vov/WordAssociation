import React, { useState } from "react";
import { JoinGame } from "@/features";
import { HomeHeader } from "@/entities/home-header";
import { GameSelectionActions } from "@/features/game-selection";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Card, Container } from "@/shared/ui";
import { Fade } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MobileHeader } from "./MobileHeader";
import { ResponsiveContainer } from "./ResponsiveContainer";

export { MobileHeader } from "./MobileHeader";
export { ResponsiveContainer } from "./ResponsiveContainer";

export type CurrentStep = "join" | null;

export type EnterGameFormsProps = {
  onJoinGame: (gameId?: string) => void;
};

export const EnterGameForms: React.FC<EnterGameFormsProps> = ({
  onJoinGame,
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
          <Container maxWidth={isMobile ? "sm" : "md"} sx={{ width: "100%", maxWidth: isMobile ? "90%" : "100%" }}>
            {!isMobile && <HomeHeader />}
            <GameSelectionActions
              onCreateGame={handleCreateGame}
              onJoinGame={() => setCurrentStep("join")}
            />
          </Container>
        </Fade>
      )}

      {currentStep === "join" && (
        <Fade in timeout={400}>
          <Container maxWidth="xs" sx={{ width: "100%", maxWidth: isMobile ? "95%" : "100%" }}>
            <Card>
              <MobileHeader 
                title={t("game.joinGame")}
                onBack={() => setCurrentStep(null)}
              />
              <JoinGame onJoinGame={handleJoinGame} />
            </Card>
          </Container>
        </Fade>
      )}
    </ResponsiveContainer>
  );
};
