import { GameRound } from "@/entities/game-round";
import { historyMockLong } from "../mock/history-mock";
import "./style.css";

export const MessengerHistory = () => {
  return (
    <div className="messenger-history">
      {Object.entries(historyMockLong).map(([round, messages]) => (
        <GameRound key={round} messages={messages} />
      ))}
    </div>
  );
};
