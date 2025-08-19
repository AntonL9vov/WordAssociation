import { MessengerHistory } from "@/features";
import { MessengerInput } from "@/features";
import "./style.css";
import { sendMessage } from "../api/hadlers";
import { useSocketStore } from "@/shared/stores/socket-store";
import { useGameStore } from "@/shared/stores/game-store";
import { useAuth } from "@/shared/context/AuthContext";

export const GameMessenger = () => {
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
    <div className="game-messenger">
      <div className="messenger-history-container">
        <MessengerHistory />
      </div>
      <div className="messenger-input-container">
        <MessengerInput onSend={handleSend} />
      </div>
    </div>
  );
};
