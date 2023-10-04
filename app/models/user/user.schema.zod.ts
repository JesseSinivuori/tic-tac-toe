import { z } from "zod";

/**zod schemas*/
export const idSchema = z.string().length(24);

export const usernameSchema = z
  .string()
  .nonempty("Username can not be empty.")
  .max(20, "Username can not be more than 20 characters.");

export type UsernameSchema = z.infer<typeof usernameSchema>;

export const populatedPlayerSchema = z.object({
  id: idSchema,
  username: usernameSchema,
});

export type PopulatedPlayerSchema = z.infer<typeof populatedPlayerSchema>;

export const playerSchema = z.object({
  userId: idSchema.or(populatedPlayerSchema),
  mark: z.literal("X").or(z.literal("O")),
});

export type PlayerSchema = z.infer<typeof playerSchema>;

export const gameSchema = z.object({
  player1: playerSchema,
  player2: playerSchema,
  winnerId: idSchema.optional(),
  loserId: idSchema.optional(),
  isDraw: z.boolean().optional(),
  date: z.date().optional(),
});

export type GameSchema = z.infer<typeof gameSchema>;

export const gameHistorySchema = z
  .object({
    wins: z.number(),
    losses: z.number(),
    draws: z.number(),
    games: z.array(gameSchema).or(z.array(idSchema)),
  })
  .optional();

export type GameHistorySchema = z.infer<typeof gameHistorySchema>;

export const userSchema = z.object({
  id: idSchema.optional(),
  email: z.string(),
  username: usernameSchema.optional(),
  gameHistory: gameHistorySchema,
});

export type UserSchema = z.infer<typeof userSchema>;
