import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const createRoom = mutation({
  args: {
    playerId: v.string(),
    board: v.object({
      board: v.array(v.string()),
      size: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const room = {
      player1Name: null,
      player2Name: null,
      player1WinStreak: 0,
      player2WinStreak: 0,
      playerOnWinStreakId: "",
      player1Id: args.playerId,
      player2Id: null,
      board: args.board,
      currentTurn: args.playerId,
      gameStatus: "ongoing" as "ongoing" | "won" | "draw",
      waitingForPlayer2ToJoin: true,
    };
    const roomId = await ctx.db.insert("rooms", room);
    return roomId;
  },
});

export const resetRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    board: v.object({
      board: v.array(v.string()),
      size: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (room) {
      const newRoom = {
        ...room,
        board: args.board,
        gameStatus: "ongoing" as "ongoing" | "won" | "draw",
      };
      await ctx.db.patch(room._id, newRoom);
    } else {
      throw new Error("Failed to reset room.");
    }
  },
});

export const getRoomById = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    return room;
  },
});

export const joinRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
    playerName: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (room && args.playerId === room.player1Id) {
      room.player1Name = args.playerName;
      const newRoom = await ctx.db.patch(room._id, room);

      return newRoom;
    }
    if (room && !room.player2Id && args.playerId !== room.player1Id) {
      room.player2Id = args.playerId;
      room.player2Name = args.playerName;
      room.waitingForPlayer2ToJoin = false;
      const newRoom = await ctx.db.patch(room._id, room);

      return newRoom;
    } else {
      // Handle error like room not found or room already full
      throw new Error("Room not found or is already full.");
    }
  },
});

export const makeTurn = mutation({
  args: {
    roomId: v.id("rooms"), // ID of the room where the game is played
    playerId: v.string(), // ID of the player making the turn
    index: v.number(), // Position on the board where the move is made
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    // Check if it's the correct player's turn and the cell is empty
    if (
      room &&
      room.player2Id &&
      room.currentTurn === args.playerId &&
      room.board.board[args.index] === "E"
    ) {
      // Make the turn
      room.board.board[args.index] =
        room.currentTurn === room.player1Id ? "X" : "O";

      // Switch turn to the other player
      room.currentTurn =
        room.currentTurn === room.player1Id ? room.player2Id : room.player1Id;

      await ctx.db.patch(room._id, room);
      return room.board;
    }

    throw new Error("Invalid move.");
  },
});

export const winner = mutation({
  args: { roomId: v.id("rooms"), playerId: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (room) {
      room.gameStatus = "won";
      room.playerOnWinStreakId = args.playerId;
      if (room.playerOnWinStreakId === room.player1Id) {
        room.player1WinStreak += 1;
        room.player2WinStreak = 0; // Reset the other player's win streak
      } else if (room.playerOnWinStreakId === room.player2Id) {
        room.player2WinStreak += 1;
        room.player1WinStreak = 0; // Reset the other player's win streak
      }
      await ctx.db.patch(room._id, room);
    } else {
      throw new Error("Room not found.");
    }
  },
});

export const draw = mutation({
  args: { roomId: v.id("rooms"), playerId: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (room) {
      room.gameStatus = "draw";
      room.player1WinStreak = 0;
      room.player2WinStreak = 0;
      await ctx.db.patch(room._id, room);
    } else {
      throw new Error("Room not found.");
    }
  },
});
