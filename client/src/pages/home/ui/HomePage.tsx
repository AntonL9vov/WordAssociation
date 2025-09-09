import { EnterGame } from "@/widgets";
import "./style.css";
import { useEffect } from "react";
import { isPlayerInGame } from "../api/api";
import { useAuth } from "@/shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/shared/stores/game-store";

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const setGame = useGameStore((state) => state.setGame);

  useEffect(() => {
    if (user) {
      isPlayerInGame(user.id).then((response) => {
        if (response) {
          setGame(response);
          navigate("/game");
        }
      });
    }
  }, [user]);

  return (
    <div className="home-page">
      <EnterGame />
    </div>
  );
};
