import React from "react";
import { useTranslation } from "react-i18next";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { GameActionCard } from "@/entities/game-action-card";
import { Stack } from "@mui/material";
import { Rocket as RocketIcon, Group as GroupIcon } from "@mui/icons-material";

interface GameSelectionActionsProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
}

export const GameSelectionActions: React.FC<GameSelectionActionsProps> = ({
  onCreateGame,
  onJoinGame,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={isMobile ? 1.5 : 3}
      sx={{
        alignItems: "stretch",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <GameActionCard
        title={t("game.createGame")}
        description={t("game.createGameDescription")}
        icon={<RocketIcon />}
        buttonText={t("game.createNewGame")}
        colorScheme="primary"
        onClick={onCreateGame}
      />

      <GameActionCard
        title={t("game.joinGame")}
        description={t("game.joinGameDescription")}
        icon={<GroupIcon />}
        buttonText={t("game.joinGame")}
        colorScheme="secondary"
        onClick={onJoinGame}
      />
    </Stack>
  );
};
