import { EnterGameForms } from "@/features";
import { createGame, joinGame } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Game } from "@/shared/lib/types";
import { useGameStore } from "@/shared/stores/game-store";
import { useAuth } from "@/shared/context/AuthContext";
import { useState } from "react";
import { Container } from "@/shared/ui";
import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

export const EnterGame = () => {
  const navigate = useNavigate();
  const setGame = useGameStore((state) => state.setGame);
  const user = useAuth();
  const { t } = useTranslation();
  const [joinError, setJoinError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const clearErrors = () => {
    setJoinError(null);
    setCreateError(null);
  };

  const handleJoinGame = async (gameId?: string) => {
    if (!user.user) {
      return;
    }

    clearErrors();

    const id = user.user.id;
    let response: Game | null = null;

    try {
      if (gameId) {
        response = await joinGame(gameId, id);
      } else {
        response = await createGame(id);
      }
      if (response) {
        setGame(response);
        navigate("/game");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("common.unknownError");
      if (gameId) {
        setJoinError(message);
      } else {
        setCreateError(message);
      }
    }
  };

  return (
    <>
      <EnterGameForms
        onJoinGame={handleJoinGame}
        joinError={joinError}
        onClearJoinError={() => clearErrors()}
      />
      {createError && (
        <Container>
          <Alert severity="error" variant="outlined">
            {createError}
          </Alert>
        </Container>
      )}
    </>
  );
};
