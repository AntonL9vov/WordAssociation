import { Box, Stack, Typography } from "@mui/material";
import { GameMessage } from "@/entities/game-message";
import { useTranslation } from "react-i18next";
import { Word } from "@/shared/lib/types";

interface GameRoundMessagesProps {
  messages: Word[];
  variant: "self" | "opponent";
}

export const GameRoundMessages = ({
  messages,
  variant,
}: GameRoundMessagesProps) => {
  const { t } = useTranslation();
  return (
    <>
      {messages.length > 0 && (
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-secondary)",
              fontWeight: "medium",
              mb: 1,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textAlign: "right",
            }}
          >
            {t("messenger.yourWord")}
          </Typography>
          <Stack spacing={1}>
            {messages.map((message) => (
              <GameMessage
                key={message.id}
                message={message}
                variant={variant}
              />
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
};
