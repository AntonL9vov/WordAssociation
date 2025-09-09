import { Box } from "@mui/material";
import { Fade } from "@mui/material";
import { Round } from "@/shared";
import { GameRound } from "@/entities";
import { useGameStore } from "@/shared/stores/game-store";
import { useEffect, useState } from "react";

interface GameRoundsProps {
  history: Round[];
}

export const GameRounds = ({ history }: GameRoundsProps) => {
  const game = useGameStore((state) => state.game);
  const [isTheLastRound, setIsTheLastRound] = useState(false);

  useEffect(() => {
    if (game?.status === "finished") {
      setIsTheLastRound(true);
    }
  }, [game?.rounds, history]);

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
            <GameRound
              messages={round.words}
              roundNumber={index + 1}
              isTheLastRound={history.length - 1 === index && isTheLastRound}
            />
          </Box>
        </Fade>
      ))}
    </>
  );
};
