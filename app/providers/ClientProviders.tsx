"use client";
import ConvexClientProvider from "./ConvexClientProvider";
import GameLogicProvider from "./GameLogicProvider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <GameLogicProvider>{children}</GameLogicProvider>
    </ConvexClientProvider>
  );
}
