import { MessengerHistory } from "@/features";
import { MessengerInput } from "@/features";
import "./style.css";

export const GameMessenger = () => {
  const handleSend = (message: string) => {
    console.log("send", message);
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
