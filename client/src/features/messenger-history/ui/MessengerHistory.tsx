import React, { useRef, useEffect } from "react";
import { useGameStore } from "@/shared/stores/game-store";
import { onGameRoundFinished } from "../api/listeners";
import { useSocketStore } from "@/shared/stores/socket-store";
import { Box, Typography } from "@mui/material";
import {
  History as HistoryIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import { RoundStatus } from "@/entities";
import { GameRounds } from "@/entities";
import { GameHistoryHeader } from "@/entities";
import { EmptyHistory } from "./EmptyHistory";

export const MessengerHistory: React.FC = () => {
  const historyRef = useRef<HTMLDivElement>(null);
  const socket = useSocketStore((state) => state.socket);
  const setGame = useGameStore((state) => state.setGame);
  const game = useGameStore((state) => state.game);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const cleanup = onGameRoundFinished(setGame, socket);

    return () => {
      cleanup();
    };
  }, [socket, setGame]);

  const history = useGameStore((state) => state.game?.rounds || []);

  useEffect(() => {
    if (historyRef.current && historyRef.current.scrollHeight > 0) {
      try {
        historyRef.current.scrollTop = historyRef.current.scrollHeight;
      } catch (error) {
        console.warn("Failed to scroll to bottom:", error);
      }
    }
  }, [history]);

  return (
    <Box
      ref={historyRef}
      data-testid="messenger-history"
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 0,
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "var(--bg-tertiary)",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--border-secondary)",
          borderRadius: "3px",
          "&:hover": {
            backgroundColor: "var(--border-primary)",
          },
        },
      }}
    >
      {history.length === 0 ? (
        <EmptyHistory gameStatus={game?.status} />
      ) : (
        <>
          <GameHistoryHeader roundNumber={history.length} />

          <GameRounds history={history} />

          {game?.status === "started" && (
            <RoundStatus roundNumber={history.length} />
          )}
        </>
      )}
    </Box>
  );
};
