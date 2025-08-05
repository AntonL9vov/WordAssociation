import { EnterGame } from "@/widgets";
import "./style.css";
import { gameService } from "@/shared/api/game-service";
import { useEffect } from "react";
import { isPlayerInGame } from "../api/api";
import { useAuth } from "@/shared/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      isPlayerInGame(user.id).then((response) => {
        if (response) {
          gameService.setGame(response);
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
