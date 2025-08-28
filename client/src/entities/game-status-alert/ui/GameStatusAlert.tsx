import React from "react";
import { Alert, Box, Button } from "@mui/material";
import { Text } from "@/shared/ui";
import { useTranslation } from "react-i18next";

interface GameStatusAlertProps {
  status: "created" | "started" | "finished";
  restartGame: () => void;
}

export const GameStatusAlert: React.FC<GameStatusAlertProps> = ({
  status,
  restartGame,
}) => {
  const { t } = useTranslation();
  
  if (status !== "finished") {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 2,
      }}
    >
      <Alert
        severity="success"
        sx={{
          borderRadius: "var(--radius-lg)",
          "& .MuiAlert-icon": {
            fontSize: "24px",
          },
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text variant="body1" weight="medium">
          🎉 {t("game.gameCompleted")}
        </Text>
      </Alert>
      <Button
        sx={{
          width: "30%",
          minWidth: "150px",
          height: "100%",
        }}
        variant="contained"
        color="primary"
        onClick={restartGame}
      >
        {t("game.restartGame")}
      </Button>
    </Box>
  );
};
