import { GameMessage } from "@/entities/game-message";
import { separateMessages } from "@/entities/game-round/utils/separate-messages";
import "./style.css";
import { Word } from "@/shared/lib/types";
import { useAuth } from "@/shared/context/AuthContext";

type GameRoundProps = {
  messages: Word[];
};

export const GameRound = ({ messages }: GameRoundProps) => {
  const { user } = useAuth();
  const { selfMessages, opponentMessages } = separateMessages(
    messages,
    user?.id || ""
  );

  return (
    <>
      {selfMessages.length + opponentMessages.length > 0 && (
        <div className="game-round" data-testid="game-round">
          <div className="self-messages">
            {selfMessages.map((message) => (
              <GameMessage key={message.id} message={message} />
            ))}
          </div>
          <div className="opponent-messages">
            {opponentMessages.map((message) => (
              <GameMessage key={message.id} message={message} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
