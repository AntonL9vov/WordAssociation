import type { Message } from "@/entities/game-message";

export interface RoundMessages {
  round: number;
  messages: Record<string, Message>;
}
