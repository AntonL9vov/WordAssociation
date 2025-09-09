import { useTranslation } from "react-i18next";
import { Box, Stack, Typography } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";
import { Game } from "@/shared";

type GameStatus = Game["status"];

export const GameMessengerHeader = ({
  gameStatus,
}: {
  gameStatus?: GameStatus;
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "var(--bg-elevated)",
        borderBottom: "1px solid var(--border-primary)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <ChatIcon sx={{ color: "var(--primary-600)" }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "var(--text-primary)",
          }}
        >
          {t("messenger.title")}
        </Typography>
        {gameStatus === "started" && (
          <Typography
            variant="body2"
            sx={{
              ml: "auto",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            {t("messenger.subtitle")}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
