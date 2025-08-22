import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameMessenger } from "@/widgets";
import { StartGame } from "@/widgets/start-game/ui/StartGame";
import { useGameStore } from "@/shared/stores/game-store";
import { useSocketStore } from "@/shared/stores/socket-store";
import { SocketService } from "@/shared/api/socket";
import {
  onGameFinished,
  onGameStarted,
  onRoomPlayersChanged,
} from "../api/gameListeners";
import {
  Box,
  Fade,
  LinearProgress,
  Typography,
  Alert,
  Paper,
  Chip,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Group as GroupIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);
  const gameStatus = useGameStore((state) => state.game?.status);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!game) {
      navigate("/");
      return;
    }

    if (!socket) {
      const newSocket = new SocketService(game.id);
      useSocketStore.setState({ socket: newSocket });
    }
  }, [game, socket, navigate]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const cleanupPlayersChanged = onRoomPlayersChanged(setGame, socket);
    const cleanupGameStarted = onGameStarted(setGame, socket);
    const cleanupGameFinished = onGameFinished(setGame, socket);

    return () => {
      cleanupPlayersChanged();
      cleanupGameStarted();
      cleanupGameFinished();
    };
  }, [socket, setGame]);

  if (!game) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <LinearProgress sx={{ width: '100%', maxWidth: 400, mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'var(--text-secondary)' }}>
          Loading game...
        </Typography>
      </Box>
    );
  }

  const getStatusInfo = () => {
    switch (gameStatus) {
      case "created":
        return {
          icon: <GroupIcon />,
          label: "Setup",
          color: "primary" as const,
          description: "Setting up the game"
        };
      case "started":
        return {
          icon: <PlayIcon />,
          label: "Playing",
          color: "success" as const,
          description: "Game in progress"
        };
      case "finished":
        return {
          icon: <TrophyIcon />,
          label: "Finished",
          color: "warning" as const,
          description: "Game completed"
        };
      default:
        return {
          icon: <GroupIcon />,
          label: "Unknown",
          color: "default" as const,
          description: "Unknown status"
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Fade in timeout={600}>
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {/* Заголовок игры */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 3,
            p: 3,
            background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 1,
                  color: 'var(--text-primary)',
                }}
              >
                Game Room
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'var(--text-secondary)',
                  mb: 2,
                }}
              >
                Game ID: <strong>{game.id}</strong>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={statusInfo.icon}
                  label={statusInfo.label}
                  color={statusInfo.color}
                  variant="filled"
                  sx={{
                    fontWeight: 'bold',
                    '& .MuiChip-icon': {
                      fontSize: '18px',
                    },
                  }}
                />
                <Chip
                  icon={<GroupIcon />}
                  label={`${game.players?.length || 0} players`}
                  variant="outlined"
                  sx={{
                    borderColor: 'var(--border-secondary)',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Основной контент игры */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {gameStatus === "created" && (
            <Fade in timeout={400} style={{ transitionDelay: '200ms' }}>
              <Box>
                <StartGame />
              </Box>
            </Fade>
          )}
          
          {(gameStatus === "started" || gameStatus === "finished") && (
            <Fade in timeout={400} style={{ transitionDelay: '200ms' }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <GameMessenger />
              </Box>
            </Fade>
          )}
        </Box>

        {/* Дополнительная информация */}
        {gameStatus === "finished" && (
          <Alert 
            severity="success" 
            sx={{ 
              mt: 2,
              borderRadius: 'var(--radius-lg)',
              '& .MuiAlert-icon': {
                fontSize: '24px',
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              🎉 Game completed! Great job everyone!
            </Typography>
          </Alert>
        )}
      </Box>
    </Fade>
  );
};
