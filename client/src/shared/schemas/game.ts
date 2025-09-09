import { z } from "zod";
import { userSchema } from "./user";

const iso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
export const isoDateString = z.string().refine((val) => {
  if (!iso8601.test(val)) return false;
  const t = Date.parse(val);
  return Number.isFinite(t);
}, { message: "Invalid ISO date-time string" });

export const wordSchema = z.object({
  id: z.string(),
  word: z.string(),
  playerId: z.string(),
  playerName: z.string(),
  timestamp: z.date(),
});

export const roundSchema = z.object({
  id: z.string(),
  words: z.array(wordSchema),
  createdAt: isoDateString,
  updatedAt: isoDateString,
});

export const gameSchema = z.object({
  id: z.string(),
  players: z.array(userSchema),
  startWord: z.string().nullable(),
  createdAt: isoDateString,
  updatedAt: isoDateString,
  status: z.enum(["created", "started", "finished"]),
  rounds: z.array(roundSchema),
  playersEmittedWords: z.record(z.string(), z.string()),
});
