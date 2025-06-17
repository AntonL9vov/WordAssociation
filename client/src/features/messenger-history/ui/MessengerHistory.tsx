import { GameRound } from "@/entities/game-round";
import { useRef, useEffect } from "react";
import { historyMockLong } from "../mock/history-mock";
import "./style.css";

interface MessengerHistoryProps {
  withMock?: boolean;
}

export const MessengerHistory = ({
  withMock = false,
}: MessengerHistoryProps) => {
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, []);

  const history = withMock ? historyMockLong : [];

  return (
    <div
      className="messenger-history"
      ref={historyRef}
      data-testid="messenger-history"
    >
      {Object.entries(history).map(([round, messages]) => (
        <GameRound key={round} messages={messages} />
      ))}
    </div>
  );
};
