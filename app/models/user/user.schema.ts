import { Schema, Model, models, model } from "mongoose";
import { GameSchema, UserSchema } from "./user.schema.zod";

/**mongoose  schemas*/
const playerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mark: { type: String, enum: ["X", "O"], required: true },
});

playerSchema.set("toJSON", {
  transform: (_doc, player) => {
    if (player._id) {
      player.id = player._id.toString();
    }
    delete player._id;
    delete player.__v;

    if (player.userId && player.userId._id) {
      player.userId.id = player.userId._id.toString();
      delete player.userId._id;
    }

    return player;
  },
});

const gameSchema = new Schema({
  player1: { type: playerSchema, required: true },
  player2: { type: playerSchema, required: true },
  winnerId: { type: Schema.Types.ObjectId, default: null },
  loserId: { type: Schema.Types.ObjectId, default: null },
  isDraw: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

gameSchema.set("toJSON", {
  transform: (_doc, game) => {
    if (game._id) {
      game.id = game._id.toString();
    }
    delete game._id;
    delete game.__v;

    return game;
  },
});

const gameHistorySchema = new Schema({
  wins: { type: Number, default: 0, required: true },
  losses: { type: Number, default: 0, required: true },
  draws: { type: Number, default: 0, required: true },
  games: { type: [Schema.Types.ObjectId], ref: "Game", default: [] },
});

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  gameHistory: { type: gameHistorySchema, default: {} },
});

userSchema.set("toJSON", {
  transform: (_doc, user) => {
    if (user._id) {
      user.id = user._id.toString();
    }
    delete user._id;
    delete user.__v;

    return user;
  },
});

export const Game: Model<GameSchema> = models.Game || model("Game", gameSchema);

export const User: Model<UserSchema> = models.User || model("User", userSchema);
