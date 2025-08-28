import React from "react";
import { useTranslation } from "react-i18next";
import { GameMessage } from "@/entities/game-message";
import { separateMessages } from "@/entities/game-round/utils/separate-messages";
import { Word } from "@/shared/lib/types";
import { useAuth } from "@/shared/context/AuthContext";
import { usePluralization } from "@/shared/hooks";
import { Box, Paper, Typography, Chip, Stack, Divider } from "@mui/material";
import {
  PlayCircle as RoundIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

type GameRoundProps = {
  messages: Word[];
  roundNumber?: number;
};

export const GameRound: React.FC<GameRoundProps> = ({
  messages,
  roundNumber,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { words, formatCount } = usePluralization();
  const { selfMessages, opponentMessages } = separateMessages(
    messages,
    user?.id || ""
  );

  if (selfMessages.length + opponentMessages.length === 0) {
    return null;
  }

  // Проверяем, завершился ли раунд (все слова одинаковые)
  const isRoundComplete =
    messages.length > 1 &&
    messages.every(
      (msg) => msg.word.toLowerCase() === messages[0].word.toLowerCase()
    );

  return (
    <Paper
      elevation={0}
      data-testid="game-round"
      sx={{
        p: 3,
        borderRadius: "var(--radius-xl)",
        border: isRoundComplete
          ? "2px solid var(--success-300)"
          : "1px solid var(--border-primary)",
        backgroundColor: isRoundComplete
          ? "var(--success-50)"
          : "var(--bg-elevated)",
        transition: "all var(--transition-normal)",
        position: "relative",
        overflow: "hidden",
        "&::before": isRoundComplete
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background:
                "linear-gradient(135deg, var(--success-500), var(--success-600))",
            }
          : {},
      }}
    >
      {/* Заголовок раунда */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RoundIcon
              sx={{
                color: isRoundComplete
                  ? "var(--success-600)"
                  : "var(--primary-600)",
                fontSize: 20,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: isRoundComplete
                  ? "var(--success-700)"
                  : "var(--text-primary)",
              }}
            >
              {roundNumber
                ? `${t("messenger.round")} ${roundNumber}`
                : t("game.gameRound")}
            </Typography>
          </Box>

          {isRoundComplete && (
            <Chip
              icon={<CheckIcon />}
              label={t("game.matchFound")}
              color="success"
              variant="filled"
              size="small"
              sx={{
                fontWeight: "bold",
                "& .MuiChip-icon": {
                  fontSize: "16px",
                },
              }}
            />
          )}
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: "var(--text-muted)",
            mt: 0.5,
          }}
        >
                     {isRoundComplete
             ? `${t("messenger.allPlayersChose")}: "${messages[0].word}"`
             : `${formatCount(Math.max(2, Math.min(100, messages.length)), words)} ${t("messenger.submitted")}`}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Сообщения */}
      <Stack spacing={2}>
        {/* Собственные сообщения */}
        {selfMessages.length > 0 && (
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
              }}
            >
              {t("messenger.yourWord")}
            </Typography>
            <Stack spacing={1}>
              {selfMessages.map((message) => (
                <GameMessage
                  key={message.id}
                  message={message}
                  variant="self"
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Сообщения оппонентов */}
        {opponentMessages.length > 0 && (
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
              }}
            >
              {t("messenger.otherPlayers")}
            </Typography>
            <Stack spacing={1}>
              {opponentMessages.map((message) => (
                <GameMessage
                  key={message.id}
                  message={message}
                  variant="opponent"
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
