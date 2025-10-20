import { EnterGame, LoadingState } from "@/widgets";
import { useEffect, useState } from "react";
import { isPlayerInGame } from "../api/api";
import { useAuth } from "@/shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/shared/stores/game-store";

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const setGame = useGameStore((state) => state.setGame);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      isPlayerInGame(user.id)
        .then((response) => {
          if (response) {
            setGame(response);
            navigate("/game");
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [user?.id]);

  return isLoading ? (
    <LoadingState />
  ) : (
    <div className="home-page">
      <EnterGame />
    </div>
  );
};
