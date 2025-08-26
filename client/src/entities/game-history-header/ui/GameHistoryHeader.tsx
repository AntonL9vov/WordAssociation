import { Box, Divider, Typography } from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";
import { Round } from "@/shared";

interface GameHistoryHeaderProps {
  roundNumber: number;
}

export const GameHistoryHeader = ({ roundNumber }: GameHistoryHeaderProps) => {
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
        Game Rounds ({roundNumber})
      </Typography>
      <Divider sx={{ mt: 1 }} />
    </Box>
  );
};
