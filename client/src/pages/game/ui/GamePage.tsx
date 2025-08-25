import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/shared/stores/game-store";
import { useSocketStore } from "@/shared/stores/socket-store";
import { SocketService } from "@/shared/api/socket";
import { GameHeader } from "@/entities/game-header";
import { GameStatusAlert } from "@/entities/game-status-alert";
import { GameContent } from "@/features";
import { LoadingState } from "@/widgets/loading-state";
import {
  onGameFinished,
  onGameStarted,
  onRoomPlayersChanged,
} from "../api/gameListeners";
import { Box, Fade } from "@mui/material";

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

  if (!game || !gameStatus) {
    return <LoadingState message="Loading game..." />;
  }

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
        <GameHeader
          gameId={game.id}
          status={gameStatus}
          playersCount={game.players?.length || 0}
        />

        <GameContent gameStatus={gameStatus} />

        <GameStatusAlert status={gameStatus} />
      </Box>
    </Fade>
  );
};