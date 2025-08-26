import { Box, Typography, Zoom } from "@mui/material";
import { PlayArrow as PlayIcon } from "@mui/icons-material";

export const RoundStatus = ({ roundNumber }: { roundNumber: number }) => {
  return (
    <Zoom in timeout={400}>
      <Box
        sx={{
          p: 2,
          backgroundColor: "var(--primary-50)",
          border: "2px dashed var(--primary-300)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          mt: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "var(--primary-700)",
            fontWeight: "medium",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <PlayIcon fontSize="small" />
          Round {roundNumber} - Waiting for words...
        </Typography>
      </Box>
    </Zoom>
  );
};
