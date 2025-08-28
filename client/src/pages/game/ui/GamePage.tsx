import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/shared/stores/game-store";
import { useSocketStore } from "@/shared/stores/socket-store";
import { SocketService } from "@/shared/api/socket";
import { GameHeader } from "@/entities/game-header";
import { GameStatusAlert } from "@/entities/game-status-alert";
import { GameContent } from "@/features";
import { LoadingState } from "@/widgets/loading-state";
import { initGameListeners, onGameWordEmitted } from "../api/gameListeners";
import { Box, Fade } from "@mui/material";
import { leaveGame, restartGame } from "../api/http";

export const GamePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);
  const clearGame = useGameStore((state) => state.clearGame);
  const gameStatus = useGameStore((state) => state.game?.status);
  const socket = useSocketStore((state) => state.socket);

  const setPlayersEmittedWords = useGameStore((state) => state.setPlayersEmittedWords);

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

    const cleanup = initGameListeners(setGame, socket);
    const cleanupWordEmitted = onGameWordEmitted(setPlayersEmittedWords, socket);

    return () => {
      cleanup();
      cleanupWordEmitted();
    };
  }, [socket, setGame]);

  const handleLeave = async () => {
    if (!game) {
      return;
    }
    const response = await leaveGame(game.id, game.players[0].id);
    if (response) {
      clearGame();
    }
  };

  const handleRestart = async () => {
    if (!game) {
      return;
    }
    const response = await restartGame(game.id);
    if (response) {
      clearGame();
    }
  };

  if (!game || !gameStatus) {
    return <LoadingState message={t('game.loading')} />;
  }

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
          gap: 2,
        }}
      >
        <GameHeader
          gameId={game.id}
          status={gameStatus}
          playersCount={game.players?.length || 0}
          onLeave={handleLeave}
        />

        <GameContent gameStatus={gameStatus} />

        <GameStatusAlert status={gameStatus} restartGame={handleRestart} />
      </Box>
    </Fade>
  );
};
