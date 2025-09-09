import { Word } from "@/shared/lib/types";

export const separateMessages = (messages: Word[], selfId: string) => {
  //TODO: Maybe rewrite to one iteration
  return {
    selfMessages: messages.filter((message) => message.playerId === selfId),
    opponentMessages: messages.filter((message) => message.playerId !== selfId),
  };
};
