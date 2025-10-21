import { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { useGameStore, useSocketStore } from "@/shared";
import { RoundStatus, GameRounds, GameHistoryHeader } from "@/entities";
import { onGameRoundFinished } from "../api/listeners";

const BoxStyles = {
  flex: 1,
  overflowY: "auto",
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  minHeight: 0,
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "var(--bg-tertiary)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "var(--border-secondary)",
    borderRadius: 3,
    "&:hover": {
      backgroundColor: "var(--border-primary)",
    },
  },
  scrollbarWidth: "thin",
  scrollbarColor: "var(--border-secondary) var(--bg-tertiary)",
};

export const MessengerHistory = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useSocketStore((state) => state.socket);
  const { t } = useTranslation();

  const { setGame, gameStatus, startWord, rounds } = useGameStore(
    useShallow((state) => ({
      setGame: state.setGame,
      gameStatus: state.game?.status,
      startWord: state.game?.startWord,
      rounds: state.game?.rounds ?? [],
    }))
  );

  useEffect(() => {
    if (!socket) return;

    const cleanup = onGameRoundFinished(setGame, socket);

    return cleanup;
  }, [socket, setGame]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rounds]);

  return (
    <Box data-testid="messenger-history" sx={BoxStyles}>
      {startWord && (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {t("messenger.startWord")}: {startWord}
        </Typography>
      )}

      <GameHistoryHeader roundNumber={rounds.length} />

      <GameRounds history={rounds} />

      {gameStatus === "started" && <RoundStatus roundNumber={rounds.length} />}

      <div ref={scrollRef} />
    </Box>
  );
};
