import React from "react";
import { GameMessengerHeader, MessengerHistory } from "@/features";
import { MessengerInput } from "@/features";
import { sendMessage } from "../api/hadlers";
import { useSocketStore } from "@/shared/stores/socket-store";
import { useGameStore } from "@/shared/stores/game-store";
import { useAuth } from "@/shared/context/AuthContext";
import { Box, Paper, Divider } from "@mui/material";

export const GameMessenger: React.FC = () => {
  const socket = useSocketStore((state) => state.socket);
  const game = useGameStore((state) => state.game);
  const { user } = useAuth();

  const handleSend = (message: string) => {
    if (!socket || !game || !user) {
      return;
    }
    sendMessage(message, game.id, user.id, socket);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-primary)",
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      <GameMessengerHeader gameStatus={game?.status} />

      <MessengerHistory />

      <Divider />

      {game?.status === "started" && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "var(--bg-elevated)",
          }}
        >
          <MessengerInput onSend={handleSend} />
        </Box>
      )}
    </Paper>
  );
};
