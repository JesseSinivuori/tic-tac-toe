"use client";
import ConvexClientProvider from "./ConvexClientProvider";
import GameLogicProvider from "./GameLogicProvider";
import ThemeProvider from "./ThemeProvider";
import { UserProvider } from "./UserProvider";

export default function ClientProviders({
  children,
  darkModeCookie,
}: {
  children: React.ReactNode;
  darkModeCookie: boolean;
}) {
  return (
    <ConvexClientProvider>
      <UserProvider>
        <ThemeProvider darkModeCookie={darkModeCookie}>
          <GameLogicProvider>{children}</GameLogicProvider>
        </ThemeProvider>
      </UserProvider>
    </ConvexClientProvider>
  );
}
