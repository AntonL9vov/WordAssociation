import { z } from "zod";
import { gameSchema, roundSchema, wordSchema } from "../schemas/game";
import { userSchema } from "../schemas/user";

export type User = z.infer<typeof userSchema>;

export type Game = z.infer<typeof gameSchema>;

export type Word = z.infer<typeof wordSchema>;

export type Round = z.infer<typeof roundSchema>;