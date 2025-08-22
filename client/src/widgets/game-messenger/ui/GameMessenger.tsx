import React from "react";
import { MessengerHistory } from "@/features";
import { MessengerInput } from "@/features";
import { sendMessage } from "../api/hadlers";
import { useSocketStore } from "@/shared/stores/socket-store";
import { useGameStore } from "@/shared/stores/game-store";
import { useAuth } from "@/shared/context/AuthContext";
import {
  Box,
  Paper,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import {
  Chat as ChatIcon,
} from "@mui/icons-material";

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
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-primary)',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      {/* Заголовок мессенджера */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ChatIcon sx={{ color: 'var(--primary-600)' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'var(--text-primary)',
            }}
          >
            Game Chat
          </Typography>
          {game?.status === "started" && (
            <Typography
              variant="body2"
              sx={{
                ml: 'auto',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}
            >
              Submit your words and chat with players
            </Typography>
          )}
        </Stack>
      </Box>

      {/* История сообщений */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <MessengerHistory />
      </Box>

      {/* Разделитель */}
      <Divider />

      {/* Поле ввода */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'var(--bg-elevated)',
        }}
      >
        <MessengerInput 
          onSend={handleSend}
          isInputDisabled={game?.status === "finished"}
        />
      </Box>
    </Paper>
  );
};
