import React, { useRef, useEffect } from "react";
import { GameRound } from "@/entities/game-round";
import { useGameStore } from "@/shared/stores/game-store";
import { onGameRoundFinished } from "../api/listeners";
import { useSocketStore } from "@/shared/stores/socket-store";
import {
  Box,
  Typography,
  Fade,
  Zoom,
  Divider,
} from "@mui/material";
import {
  History as HistoryIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";

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

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  });

  const history = useGameStore((state) => state.game?.rounds || []);

  return (
    <Box
      ref={historyRef}
      data-testid="messenger-history"
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: 0,
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--border-secondary)',
          borderRadius: '3px',
          '&:hover': {
            backgroundColor: 'var(--border-primary)',
          },
        },
      }}
    >
      {history.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            py: 4,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            {game?.status === "started" ? (
              <PlayIcon sx={{ fontSize: 40, color: 'var(--text-muted)' }} />
            ) : (
              <HistoryIcon sx={{ fontSize: 40, color: 'var(--text-muted)' }} />
            )}
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: 'var(--text-secondary)',
              fontWeight: 'medium',
              mb: 1,
            }}
          >
            {game?.status === "started" 
              ? "Game Started!" 
              : "No rounds yet"
            }
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-muted)',
              maxWidth: 300,
            }}
          >
            {game?.status === "started"
              ? "Submit your first word to begin the word association chain"
              : "Game rounds will appear here once the game starts"
            }
          </Typography>
        </Box>
      ) : (
        <>
          {/* Заголовок истории */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-muted)',
                fontWeight: 'medium',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <HistoryIcon fontSize="small" />
              Game Rounds ({history.length})
            </Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>

          {/* Раунды */}
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

          {/* Индикатор текущего раунда */}
          {game?.status === "started" && (
            <Zoom in timeout={400}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'var(--primary-50)',
                  border: '2px dashed var(--primary-300)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  mt: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--primary-700)',
                    fontWeight: 'medium',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <PlayIcon fontSize="small" />
                  Round {history.length + 1} - Waiting for words...
                </Typography>
              </Box>
            </Zoom>
          )}
        </>
      )}
    </Box>
  );
};
