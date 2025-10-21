import { Word } from "@/shared/lib/types";

export const separateMessages = (messages: Word[], selfId: string) =>
  messages.reduce(
    (acc, message) => {
      const key =
        message.playerId === selfId ? "selfMessages" : "opponentMessages";
      acc[key].push(message);
      return acc;
    },
    { selfMessages: [] as Word[], opponentMessages: [] as Word[] }
  );
