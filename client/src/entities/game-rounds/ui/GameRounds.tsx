import { Box } from "@mui/material";
import { Fade } from "@mui/material";
import { Round } from "@/shared";
import { GameRound } from "@/entities";
import { useGameStore } from "@/shared/stores/game-store";

interface GameRoundsProps {
  history: Round[];
}

export const GameRounds = ({ history }: GameRoundsProps) => {
  const game = useGameStore((state) => state.game);
  const isTheLastRound = game?.status === "finished";

  return (
    <>
      {history.map((round, index) => (
        <Fade
          key={round.id}
          in
          timeout={{ enter: 300, exit: 150 }}
          style={{ transitionDelay: `${index * 50}ms` }}
          unmountOnExit
          appear
        >
          <Box>
            <GameRound
              key={round.id}
              messages={round.words}
              roundNumber={index + 1}
              isTheLastRound={index === history.length - 1 && isTheLastRound}
            />
          </Box>
        </Fade>
      ))}
    </>
  );
};
