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
      const email = user.email;

      const res = await fetch(`${baseUrl}/api/users/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
