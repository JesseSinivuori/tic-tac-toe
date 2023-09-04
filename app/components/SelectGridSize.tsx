"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function SelectGridSize({
  setSize,
  setBoard,
  generateBoard,
  setIsPlayingAgainstAi,
}: {
  setSize: React.Dispatch<React.SetStateAction<number>>;
  setBoard: React.Dispatch<React.SetStateAction<string[]>>;
  generateBoard: (size: number) => string[];
  setIsPlayingAgainstAi: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleValueChange = (value: string) => {
    const newSize = Number(value);
    setSize(newSize);
    setBoard(generateBoard(newSize));
    if (newSize === 7) setIsPlayingAgainstAi(false);
  };

  return (
    <Select onValueChange={(value: string) => handleValueChange(value)}>
      <SelectTrigger className="w-[80px] bg-zinc-950 text-white border-white/10">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-950 text-white border-white/10">
        <SelectItem value="3">3x3</SelectItem>
        <SelectItem value="5">5x5</SelectItem>
        <SelectItem value="7">7x7</SelectItem>
      </SelectContent>
    </Select>
  );
}
