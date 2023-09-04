"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function SelectPlayMode({
  handleClickPlayAgainstAI,
  handleClickPlayAgainstBot,
  handleClickPlayLocally,
  setBoard,
  size,
  generateBoard,
  setIsPlayingAgainstAi,
  isPlayingAgainstAi,
}: {
  handleClickPlayAgainstAI: () => void;
  handleClickPlayAgainstBot: () => void;
  handleClickPlayLocally: () => void;
  setBoard: React.Dispatch<React.SetStateAction<string[]>>;
  size: number;
  generateBoard: (size: number) => string[];
  setIsPlayingAgainstAi: React.Dispatch<React.SetStateAction<boolean>>;
  isPlayingAgainstAi: boolean;
}) {
  const handleValueChange = (value: string) => {
    setBoard(generateBoard(size));
    if (value === "ai") handleClickPlayAgainstAI();
    if (value === "bot") handleClickPlayAgainstBot();
    if (value === "local") handleClickPlayLocally();
    if (size === 7 && isPlayingAgainstAi) {
      handleClickPlayLocally();
      setIsPlayingAgainstAi(false);
    }
  };

  return (
    <Select onValueChange={(value: string) => handleValueChange(value)}>
      <SelectTrigger className="w-[220px] bg-zinc-950 text-white border-white/10">
        <SelectValue placeholder="Opponent" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-950 text-white border-white/10">
        <SelectItem
          value="ai"
          disabled={size === 7}
          title={size === 7 ? "AI can not play on 7x7 grid." : ""}
        >
          Play against AI 🪄
        </SelectItem>
        <SelectItem value="bot">Play against easy bot 🤖</SelectItem>
        <SelectItem value="local">Play locally 🖥️</SelectItem>
      </SelectContent>
    </Select>
  );
}
