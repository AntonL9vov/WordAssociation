import { useTranslation } from 'react-i18next';
import { Box, Divider, Typography } from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";

interface GameHistoryHeaderProps {
  roundNumber: number;
}

export const GameHistoryHeader = ({ roundNumber }: GameHistoryHeaderProps) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="body2"
        sx={{
          color: "var(--text-muted)",
          fontWeight: "medium",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <HistoryIcon fontSize="small" />
{t('game.gameRounds')} ({roundNumber})
      </Typography>
      <Divider sx={{ mt: 1 }} />
    </Box>
  );
};
