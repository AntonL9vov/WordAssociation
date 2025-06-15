import { RoundMessages } from "../types/round-message";

export const separateMessages = (
  messages: RoundMessages,
  selfId: string = "1"
) => {
  return {
    selfMessages: Object.values(messages.messages).filter(
      (message) => message.senderId === selfId
    ),
    opponentMessages: Object.values(messages.messages).filter(
      (message) => message.senderId !== selfId
    ),
  };
};
