"use client";
import { useMutation } from "convex/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { GameMode, useGameLogicContext } from "../providers/GameLogicProvider";
import { RoomData } from "../room/[id]/page";
import { Board } from "./HomeClient";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function SelectGridSize({
  setBoard,
  generateBoard,
  setGameMode,
  roomData,
  playerId,
}: {
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  generateBoard: (size: number) => string[];
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  roomData: RoomData;
  playerId: string | null | undefined;
}) {
  const { gameMode } = useGameLogicContext();
  const handleValueChange = (value: string) => {
    const newSize = Number(value);
    if (gameMode === "MULTIPLAYER") return handleMultiplayer(newSize);

    setBoard({ board: generateBoard(newSize), size: newSize });
    if (newSize === 7) setGameMode("LOCAL");
  };

  const changeBoardSize = useMutation(api.rooms.changeBoardSize);
  const handleMultiplayer = (newSize: number) => {
    const newBoard = { board: generateBoard(newSize), size: newSize };
    changeBoardSize({ roomId: roomData?._id as Id<"rooms">, board: newBoard });
  };

  return (
    <Select
      disabled={playerId !== roomData?.player1Id}
      onValueChange={(value: string) => handleValueChange(value)}
    >
      <SelectTrigger className="w-[80px] bg-background dark:text-white text-black dark:border-white/10 border-black/10">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent className="dark:bg-zinc-950 bg-zinc-50 dark:text-white text-black dark:border-white/10 border-black/10">
        <SelectItem value="3">3x3</SelectItem>
        <SelectItem value="5">5x5</SelectItem>
        <SelectItem value="7">7x7</SelectItem>
      </SelectContent>
    </Select>
  );
}
