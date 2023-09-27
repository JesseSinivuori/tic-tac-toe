import { Session } from "next-auth";
import {
  GameHistorySchema,
  GameSchema,
  UserSchema,
  gameSchema,
  idSchema,
  userSchema,
} from "./user.schema.zod";

/** fetch functions */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchSignedInUser = async (
  session: Session,
): Promise<UserSchema | undefined> => {
  if (!session.user) return;

  if (session.user?.email) {
    const url = `${baseUrl}/api/users/email/${encodeURIComponent(
      session.user.email,
    )}`;

    const res = await fetch(url);
    const user = await res.json();

    return user;
  }
};

export const fetchUserById = async (id: string) => {
  idSchema.parse(id);

  const url = `${baseUrl}/api/users/${id}`;

  const res = await fetch(url);
  const user = await res.json();

  return user;
};

export const fetchUpdateUsername = async (user: UserSchema) => {
  try {
    userSchema.parse(user);

    const url = `${baseUrl}/api/users/${user.id}/username`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newUsername: user.username,
        email: user.email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    const newUser = data;
    return newUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const fetchAddGameHistory = async (
  gameResult: GameSchema,
  user: UserSchema,
) => {
  try {
    gameSchema.parse(gameResult);

    const url = `${baseUrl}/api/users/game-history`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameResult: gameResult,
        userEmail: user.email,
      }),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export type PaginationProps = {
  totalGames: number;
  currentPage: number;
  totalPages: number;
};

export type GameHistoryResponse = {
  pagination: PaginationProps;
  user: Omit<UserSchema, "email">;
};

export const fetchUserWithGameHistory = async (
  userId: string,
  page: number,
  limit: number,
): Promise<GameHistoryResponse> => {
  try {
    idSchema.parse(userId);

    const url = `${baseUrl}/api/users/game-history/${userId}?page=${page}&limit=${limit}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      throw new Error(data);
    }

    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
