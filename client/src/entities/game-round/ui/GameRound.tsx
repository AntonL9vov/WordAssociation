import React, { useMemo } from "react";
import { separateMessages } from "@/entities/game-round/utils/separate-messages";
import { Word } from "@/shared/lib/types";
import { useAuth } from "@/shared/context/AuthContext";
import { Paper, Stack, Divider } from "@mui/material";
import { GameRoundHeader } from "./GameRoundHeader";
import { GameRoundMessages } from "./GameRoundMessages";

type GameRoundProps = {
  messages: Word[];
  roundNumber?: number;
  isTheLastRound?: boolean;
};

const styles = {
  paper: {
    p: 3,
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--border-primary)",
    backgroundColor: "var(--bg-elevated)",
  },
  paperLastRound: {
    border: "2px solid var(--success-400)",
    backgroundColor: "var(--success-100)",
  },
};

export const GameRound: React.FC<GameRoundProps> = ({
  messages,
  roundNumber,
  isTheLastRound = false,
}) => {
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const { selfMessages, opponentMessages } = useMemo(
    () => separateMessages(messages, userId),
    [messages, userId]
  );

  const paperSx = useMemo(
    () => ({
      ...styles.paper,
      ...(isTheLastRound && styles.paperLastRound),
    }),
    [isTheLastRound]
  );

  if (!messages?.length) return null;

  return (
    <Paper elevation={0} data-testid="game-round" sx={paperSx}>
      <GameRoundHeader
        roundNumber={roundNumber}
        isTheLastRound={isTheLastRound}
        messages={messages}
      />

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2}>
        <GameRoundMessages messages={selfMessages} variant="self" />
        <GameRoundMessages messages={opponentMessages} variant="opponent" />
      </Stack>
    </Paper>
  );
};
