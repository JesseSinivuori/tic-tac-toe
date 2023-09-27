import dbConnect from "@/app/lib/dbConnect";
import { createAndSaveUser } from "@/app/models/user/user.functions";
import { User } from "@/app/models/user/user.schema";
import { UserSchema } from "@/app/models/user/user.schema.zod";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const clientId =
  process.env.NODE_ENV === "production"
    ? process.env.GITHUB_ID!
    : process.env.GITHUB_ID_DEV!;
const clientSecret =
  process.env.NODE_ENV === "production"
    ? process.env.GITHUB_SECRET!
    : process.env.GITHUB_SECRET_DEV!;

export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: clientId,
      clientSecret: clientSecret,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email;
        if (!email) return false;

        await dbConnect();

        const existingUser = await User.findOne({
          email,
        });

        if (!existingUser) {
          const newUser: UserSchema = {
            email: email,
          };

          await createAndSaveUser(newUser);
        }

        return true;
      } catch (error) {
        console.error("Error during signIn:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
