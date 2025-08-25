import React, { useState } from "react";
import { JoinGame } from "@/features";
import { HomeHeader } from "@/entities/home-header";
import { GameSelectionActions } from "@/features/game-selection";
import { Card, Text, Container } from "@/shared/ui";
import { Box, Fade, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

export type CurrentStep = "join" | null;

export type EnterGameFormsProps = {
  onJoinGame: (gameId?: string) => void;
};

export const EnterGameForms: React.FC<EnterGameFormsProps> = ({
  onJoinGame,
}) => {
  const [currentStep, setCurrentStep] = useState<CurrentStep>(null);

  const handleCreateGame = () => {
    onJoinGame();
  };

  const handleJoinGame = (gameId?: string) => {
    onJoinGame(gameId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100% - 200px)",
        py: 4,
      }}
    >
      {currentStep === null && (
        <Fade in timeout={600}>
          <Container maxWidth="md">
            <HomeHeader />
            <GameSelectionActions
              onCreateGame={handleCreateGame}
              onJoinGame={() => setCurrentStep("join")}
            />
          </Container>
        </Fade>
      )}

      {currentStep === "join" && (
        <Fade in timeout={400}>
          <Container maxWidth="sm">
            <Card>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <IconButton
                  onClick={() => setCurrentStep(null)}
                  sx={{
                    mr: 2,
                    backgroundColor: "var(--bg-tertiary)",
                    "&:hover": {
                      backgroundColor: "var(--bg-secondary)",
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Text variant="h5" weight="bold">
                  Join Game
                </Text>
              </Box>
              <JoinGame onJoinGame={handleJoinGame} />
            </Card>
          </Container>
        </Fade>
      )}
    </Box>
  );
};
