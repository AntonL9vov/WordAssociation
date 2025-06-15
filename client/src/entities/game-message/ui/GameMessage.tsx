import type { Message } from "@/entities/game-message";
import "./style.css";

type GameMessageProps = {
  message: Message;
};

export const GameMessage = ({ message }: GameMessageProps) => {
  return <div className="game-message">{message.text}</div>;
};
