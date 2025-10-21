import React from "react";
import { GameMessengerHeader, MessengerHistory } from "@/features";
import { MessengerInput } from "@/features";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { sendMessage } from "../api/hadlers";
import { useSocketStore } from "@/shared/stores/socket-store";
import { useGameStore } from "@/shared/stores/game-store";
import { useAuth } from "@/shared/context/AuthContext";
import { Box, Paper, Divider } from "@mui/material";
import { Game } from "@/shared/lib/types";
import { SocketService } from "@/shared/api/socket";

// Separated style objects for clean mobile optimization
const desktopMessengerStyles = {
  paper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--border-primary)",
    overflow: "hidden",
    minHeight: 0,
  },
  inputContainer: {
    p: 2,
    backgroundColor: "var(--bg-elevated)",
  },
};

const mobileMessengerStyles = {
  paper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-primary)",
    overflow: "hidden",
    minHeight: 0,
  },
  inputContainer: {
    p: 1.5,
    backgroundColor: "var(--bg-elevated)",
  },
};

const canSendMessage = (
  game: Game | null,
  userId: string | undefined,
  socket: SocketService | null
) => socket && game && userId && !game.playersEmittedWords[userId];

export const GameMessenger: React.FC = () => {
  const socket = useSocketStore((state) => state.socket);
  const game = useGameStore((state) => state.game);
  const { user } = useAuth();
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileMessengerStyles : desktopMessengerStyles;


  const handleSend = (message: string) => {
    const userId = user?.id;
    if (canSendMessage(game, userId, socket)) {
      sendMessage(message, game!.id, userId!, socket!);
    }
  };

  return (
    <Paper elevation={0} sx={styles.paper}>
      <GameMessengerHeader gameStatus={game?.status} />

      <MessengerHistory />

      <Divider />

      {game?.status === "started" && (
        <Box sx={styles.inputContainer}>
          <MessengerInput
            onSend={handleSend}
            disabled={!!game.playersEmittedWords[user?.id ?? ""]}
          />
        </Box>
      )}
    </Paper>
  );
};
