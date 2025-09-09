import { useTranslation } from 'react-i18next';
import { Box, Typography } from "@mui/material";
import { PlayArrow as PlayIcon } from "@mui/icons-material";
import { History as HistoryIcon } from "@mui/icons-material";
import { Game } from "@/shared";

interface EmptyHistoryProps {
  gameStatus?: Game["status"];
}

export const EmptyHistory = ({ gameStatus }: EmptyHistoryProps) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        textAlign: "center",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "var(--bg-tertiary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        {gameStatus === "started" ? (
          <PlayIcon sx={{ fontSize: 40, color: "var(--text-muted)" }} />
        ) : (
          <HistoryIcon sx={{ fontSize: 40, color: "var(--text-muted)" }} />
        )}
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: "var(--text-secondary)",
          fontWeight: "medium",
          mb: 1,
        }}
      >
{gameStatus === "started" ? t('messenger.gameStarted') : t('messenger.noRoundsYet')}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "var(--text-muted)",
          maxWidth: 300,
        }}
      >
{gameStatus === "started"
          ? t('messenger.submitFirstWord')
          : t('messenger.roundsWillAppear')}
      </Typography>
    </Box>
  );
};
