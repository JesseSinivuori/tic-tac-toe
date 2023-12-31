import {
  GameSchema,
  UserSchema,
  UsernameSchema,
  gameSchema,
  idSchema,
  userSchema,
  usernameSchema,
} from "./user.schema.zod";
import { Game, User } from "./user.schema";
import dbConnect from "@/app/lib/dbConnect";

/**mongoose functions */

export const createAndSaveUser = async (newUserData: UserSchema) => {
  userSchema.parse(newUserData);

  await dbConnect();
  const user = new User(newUserData);
  await user.save();

  return user;
};

export const updateUser = async (newUserData: UserSchema) => {
  userSchema.parse(newUserData);

  await dbConnect();
  const updatedUser = await User.findByIdAndUpdate(
    newUserData.id,
    newUserData,
    { new: true },
  );

  return updatedUser;
};

export const updateUsername = async (
  id: string,
  newUsername: UsernameSchema,
) => {
  usernameSchema.parse(newUsername);

  await dbConnect();
  const existingUsername = await User.findOne({ username: newUsername });
  if (existingUsername) {
    throw new Error("Username is already taken.");
  }

  const updatedUser = await User.findByIdAndUpdate(id, {
    username: newUsername,
    new: true,
  });

  return updatedUser;
};

export const getUserByEmail = async (email: string) => {
  await dbConnect();
  const user = await User.findOne({ email });
  return user;
};

export const getUserById = async (id: string) => {
  await dbConnect();
  const user = await User.findById(id);

  return user;
};

export const addGameHistory = async (gameResult: GameSchema) => {
  gameSchema.parse(gameResult);

  await dbConnect();
  const newGame = new Game(gameResult);
  await newGame.save();

  if (!gameResult.isDraw) {
    const winnerUser = await User.findById(gameResult.winnerId);
    const loserUser = await User.findById(gameResult.loserId);

    if (winnerUser) {
      winnerUser.gameHistory!.wins += 1;
      winnerUser.gameHistory!.games.push(newGame.id);
      await winnerUser.save();
    }

    if (loserUser) {
      loserUser.gameHistory!.losses += 1;
      loserUser.gameHistory!.games.push(newGame.id);
      await loserUser.save();
    }
  }

  if (gameResult.isDraw) {
    const player1 = await User.findById(gameResult.player1.userId);
    const player2 = await User.findById(gameResult.player2.userId);

    if (player1) {
      player1.gameHistory!.draws += 1;
      player1.gameHistory!.games.push(newGame.id);
      await player1.save();
    }

    if (player2) {
      player2.gameHistory!.draws += 1;
      player2.gameHistory!.games.push(newGame.id);
      await player2.save();
    }
  }

  return { success: true, message: "Game history updated successfully" };
};

export const getUserWithGameHistory = async (
  userId: string,
  page: number,
  limit: number,
) => {
  idSchema.parse(userId);

  const skip = (page - 1) * limit;

  await dbConnect();

  const user = await User.findById(userId)
    .select("username gameHistory")
    .populate({
      path: "gameHistory.games",
      options: { sort: { date: -1 }, skip: skip, limit: limit },
      populate: {
        path: "player1.userId player2.userId",
        model: "User",
        select: "username",
      },
    });

  if (!user || !user.gameHistory) {
    return null;
  }

  const totalGames = await Game.estimatedDocumentCount();

  return {
    pagination: {
      totalGames: totalGames,
      currentPage: page,
      totalPages: Math.ceil(totalGames / limit),
    },
    user: user,
  };
};

export const getLeaderboard = async (limit: number = 100) => {
  await dbConnect();

  const leaderboardUsers = await User.find({})
    .sort({ "gameHistory.wins": -1 })
    .limit(limit)
    .select(
      "id username gameHistory.wins gameHistory.losses gameHistory.draws",
    );

  const leaderboardData = leaderboardUsers.map((user) => ({
    id: user.id,
    username: user.username,
    wins: user.gameHistory?.wins || 0,
    losses: user.gameHistory?.losses || 0,
    draws: user.gameHistory?.draws || 0,
  }));

  return leaderboardData;
};
