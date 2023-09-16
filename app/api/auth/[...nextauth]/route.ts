import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId:
        process.env.NODE_ENV === "production"
          ? process.env.GITHUB_ID!
          : process.env.GITHUB_ID_DEV!,
      clientSecret:
        process.env.NODE_ENV === "production"
          ? process.env.GITHUB_SECRET!
          : process.env.GITHUB_SECRET_DEV!,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
