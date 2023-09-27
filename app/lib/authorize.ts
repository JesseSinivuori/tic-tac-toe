import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const isAuthorized = async (userEmail: string) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No session found.");
  }

  if (userEmail !== session?.user?.email) {
    throw new Error("Unauthorized.");
  }

  return true;
};
