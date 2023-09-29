"use client";
import { Session } from "next-auth";
import ConvexClientProvider from "./ConvexClientProvider";
import GameLogicProvider from "./GameLogicProvider";
import ThemeProvider from "./ThemeProvider";
import { UserProvider } from "./UserProvider";
import NextAuthProvider from "./NextAuthProvider";

export default function ClientProviders({
  children,
  darkModeCookie,
  session,
}: {
  children: React.ReactNode;
  darkModeCookie: boolean;
  session: Session;
}) {
  return (
    <NextAuthProvider session={session}>
      <ConvexClientProvider>
        <UserProvider>
          <ThemeProvider darkModeCookie={darkModeCookie}>
            <GameLogicProvider>{children}</GameLogicProvider>
          </ThemeProvider>
        </UserProvider>
      </ConvexClientProvider>
    </NextAuthProvider>
  );
}
