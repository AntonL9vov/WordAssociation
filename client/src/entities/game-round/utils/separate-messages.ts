import { RoundMessages } from "../types/round-message";

export const separateMessages = (
  { messages }: RoundMessages,
  selfId: string = "1"
) => {
  //TODO: Maybe rewrite to one iteration
  return {
    selfMessages: messages.filter((message) => message.senderId === selfId),
    opponentMessages: messages.filter((message) => message.senderId !== selfId),
  };
};
