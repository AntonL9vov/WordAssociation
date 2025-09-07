import { describe, it, expect } from "vitest";
import { separateMessages } from "@/entities/game-round/utils/separate-messages";
import { Word } from "@/shared/lib/types";

describe("separateMessages", () => {
  const mockMessages: Word[] = [
    {
      id: "1",
      word: "Hello from self",
      timestamp: new Date(),
      playerName: "Player 1",
      playerId: "1",
    },
    {
      id: "2",
      word: "Hello from opponent",
      timestamp: new Date(),
      playerName: "Player 2",
      playerId: "2",
    },
    {
      id: "3",
      word: "Another message from opponent",
      timestamp: new Date(),
      playerName: "Player 3",
      playerId: "3",
    },
  ];

  it("should separate messages into self and opponent messages", () => {
    const result = separateMessages(mockMessages, "1");

    expect(result.selfMessages).toHaveLength(1);
    expect(result.opponentMessages).toHaveLength(2);

    expect(result.selfMessages[0].word).toBe("Hello from self");
    expect(result.opponentMessages[0].word).toBe("Hello from opponent");
    expect(result.opponentMessages[1].word).toBe(
      "Another message from opponent"
    );
  });

  it("should use custom selfId when provided", () => {
    const result = separateMessages(mockMessages, "2");

    expect(result.selfMessages).toHaveLength(1);
    expect(result.opponentMessages).toHaveLength(2);

    expect(result.selfMessages[0].word).toBe("Hello from opponent");
    expect(result.opponentMessages[0].word).toBe("Hello from self");
    expect(result.opponentMessages[1].word).toBe(
      "Another message from opponent"
    );
  });
});
