import { Box } from "@mui/material";
import { Fade } from "@mui/material";
import { Round } from "@/shared";
import { GameRound } from "@/entities";

interface GameRoundsProps {
  history: Round[];
}

export const GameRounds = ({ history }: GameRoundsProps) => {
  return (
    <>
      {history.map((round, index) => (
        <Fade
          key={round.id}
          in
          timeout={300}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <Box>
            <GameRound messages={round.words} roundNumber={index + 1} />
          </Box>
        </Fade>
      ))}
    </>
  );
};
