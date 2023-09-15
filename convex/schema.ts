import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    board: v.object({
      board: v.array(v.string()),
      size: v.number(),
    }),
    currentTurn: v.string(),
    gameStatus: v.union(
      v.literal("ongoing"),
      v.literal("won"),
      v.literal("draw")
    ),
    player1Name: v.union(v.string(), v.null()),
    player2Name: v.union(v.string(), v.null()),
    player1WinStreak: v.number(),
    player2WinStreak: v.number(),
    playerOnWinStreakId: v.string(),
    player1Id: v.string(),
    player2Id: v.union(v.string(), v.null()),
    waitingForPlayer2ToJoin: v.boolean(),
  }),
});
