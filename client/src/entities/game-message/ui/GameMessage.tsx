import type { Word } from "@/shared/lib/types";
import "./style.css";

type GameMessageProps = {
  message: Word;
};

export const GameMessage = ({ message }: GameMessageProps) => {
  return <div className="game-message">{message.word}</div>;
};
