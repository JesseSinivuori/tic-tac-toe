"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { GameMode } from "../providers/GameLogicProvider";
import { RoomData } from "../room/[id]/page";
import { Board } from "./HomeClient";

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
  const handleValueChange = (value: string) => {
    const newSize = Number(value);
    setBoard({ board: generateBoard(newSize), size: newSize });
    if (newSize === 7) setGameMode("LOCAL");
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
