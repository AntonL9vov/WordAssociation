import { Box, Stack, Typography, Chip } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import { Word } from "@/shared/lib/types";
import { usePluralization } from "@/shared/hooks";

interface GameRoundHeaderProps {
  roundNumber?: number;
  isTheLastRound?: boolean;
  messages: Word[];
}

export const GameRoundHeader = ({
  roundNumber,
  isTheLastRound,
  messages,
}: GameRoundHeaderProps) => {
  const { t } = useTranslation();
  const { words, formatCount } = usePluralization();
  
  const getSubmittedText = (count: number) =>
    `${formatCount(Math.max(2, Math.min(100, count)), words)} ${t(
      "messenger.submitted"
    )}`;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PlayCircleIcon
            sx={{
              color: isTheLastRound
                ? "var(--success-600)"
                : "var(--primary-600)",
              fontSize: 20,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: isTheLastRound
                ? "var(--success-600)"
                : "var(--text-primary)",
            }}
          >
            {roundNumber
              ? `${t("messenger.round")} ${roundNumber}`
              : t("game.gameRound")}
          </Typography>
        </Box>

        {isTheLastRound && (
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
        {isTheLastRound
          ? `${t("messenger.allPlayersChose")}: "${messages[0].word}"`
          : getSubmittedText(messages.length)}
      </Typography>
    </Box>
  );
};
