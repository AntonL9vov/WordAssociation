import { StartGame, GameMessenger } from "@/widgets";
import { Box, Fade } from "@mui/material";

export interface GameContentProps {
  gameStatus: "created" | "started" | "finished";
}

export const GameContent = ({ gameStatus }: GameContentProps) => {
  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      <Fade in timeout={400} style={{ transitionDelay: "200ms" }}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {gameStatus === "created" && <StartGame />}
          {(gameStatus === "started" || gameStatus === "finished") && (
            <GameMessenger />
          )}
        </Box>
      </Fade>
    </Box>
  );
};
