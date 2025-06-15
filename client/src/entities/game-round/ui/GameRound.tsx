import type { RoundMessages } from "@/entities/game-round";
import { GameMessage } from "@/entities/game-message";
import { separateMessages } from "@/entities/game-round/utils/separate-messages";
import "./style.css";

type GameRoundProps = {
  messages: RoundMessages;
};

export const GameRound = ({ messages }: GameRoundProps) => {
  const { selfMessages, opponentMessages } = separateMessages(messages);
  return (
    <div className="game-round">
      <div className="self-messages">
        {Object.entries(selfMessages).map(([id, message]) => (
          <GameMessage key={id} message={message} />
        ))}
      </div>
      <div className="opponent-messages">
        {Object.entries(opponentMessages).map(([id, message]) => (
          <GameMessage key={id} message={message} />
        ))}
      </div>
    </div>
  );
};
