"use client";
import { createContext, useContext, useState } from "react";
export type GameStatus = "ongoing" | "won" | "draw";

const GameLogicContext = createContext<GameLogicProps>(null);

export type GameMode = "AI" | "BOT" | "LOCAL" | "MULTIPLAYER";

type GameLogicProps = {
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
} | null;

export default function GameLogicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gameMode, setGameMode] = useState<GameMode>("LOCAL");
  const [gameStatus, setGameStatus] = useState<GameStatus>("ongoing");
  return (
    <GameLogicContext.Provider
      value={{ gameMode, setGameMode, gameStatus, setGameStatus }}
    >
      {children}
    </GameLogicContext.Provider>
  );
}

export const useGameLogicContext = () => {
  const context = useContext(GameLogicContext);
  if (!context) {
    throw new Error(
      "useGameLogicContext must be used within GameLogicProvider",
    );
  }
  return context;
};
