import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/shared/stores/game-store";
import { useSocket } from "@/shared/hooks/useSocket";
import { GameHeader } from "@/entities";
import { GameStatusAlert } from "@/entities";
import { GameContent } from "@/entities";
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
  const setPlayersEmittedWords = useGameStore(
    (state) => state.setPlayersEmittedWords
  );

  const { socket, isConnected } = useSocket(game?.id);

  useEffect(() => {
    if (!game) {
      navigate("/");
    }
  }, [game, navigate]);

  useEffect(() => {
    if (!socket || !isConnected || !game) {
      return;
    }

    const cleanupGameUpdateSockets = initGameListeners(setGame, socket);
    const cleanupGameWordSockets = onGameWordEmitted(
      setPlayersEmittedWords,
      socket
    );

    return () => {
      cleanupGameUpdateSockets();
      cleanupGameWordSockets();
    };
  }, [socket, isConnected, game?.id, setGame, setPlayersEmittedWords]);

  const handleLeave = async () => {
    if (!game) {
      return;
    }
    try {
      const response = await leaveGame(game.id, game.players[0].id);
      if (response) {
        clearGame();
      }
    } catch (error) {
      console.error("Error leaving game:", error);
    }
  };

  const handleRestart = async () => {
    if (!game) {
      return;
    }
    try {
      const response = await restartGame(game.id);
      if (response) {
        clearGame();
      }
    } catch (error) {
      console.error("Error restarting game:", error);
    }
  };

  if (!game || !gameStatus) {
    return <LoadingState message={t("game.loading")} />;
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
