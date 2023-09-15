"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Board, generateBoard } from "./HomeClient";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import {
  getPlayerIdFromLocalStorage,
  setGameModeToLocalStorage,
  setPlayerIdToLocalStorage,
} from "../lib/localStorage";
import { GameMode } from "../providers/GameLogicProvider";
import { RoomData } from "../room/[id]/page";

export default function SelectGameMode({
  handleClickPlayAgainstAI,
  handleClickPlayAgainstBot,
  handleClickPlayLocally,
  board,
  setGameMode,
  gameMode,
  playerId,
  roomData,
}: {
  handleClickPlayAgainstAI: () => void;
  handleClickPlayAgainstBot: () => void;
  handleClickPlayLocally: () => void;
  board: Board;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  gameMode: GameMode;
  playerId: string | null | undefined;
  roomData: RoomData;
}) {
  const router = useRouter();
  const createRoom = useMutation(api.rooms.createRoom);

  const handleClickPlayMultiplayer = () => {
    const newBoard = { board: generateBoard(board.size), size: board.size };
    setGameModeToLocalStorage({ gameMode: "MULTIPLAYER" });
    let playerId = getPlayerIdFromLocalStorage();

    if (!playerId) {
      playerId = crypto.randomUUID();
      setPlayerIdToLocalStorage(playerId);
    }

    createRoom({ playerId: playerId, board: newBoard }).then((roomId) =>
      router.push(`/room/${roomId}`)
    );
  };

  const handleValueChange = (value: string) => {
    if (value === "ai") handleClickPlayAgainstAI();
    if (value === "bot") handleClickPlayAgainstBot();
    if (value === "local") handleClickPlayLocally();
    if (value === "multiplayer") handleClickPlayMultiplayer();
    if (board.size === 7 && gameMode === "AI") {
      handleClickPlayLocally();
      setGameMode("LOCAL");
    }
    if (value !== "multiplayer") router.push("/");
  };

  return (
    <Select
      disabled={playerId !== roomData?.player1Id}
      onValueChange={(value: string) => handleValueChange(value)}
    >
      <SelectTrigger className="w-[220px] bg-background dark:text-white text-black dark:border-white/10 border-black/10">
        <SelectValue placeholder="Opponent" />
      </SelectTrigger>
      <SelectContent className="dark:bg-zinc-950 bg-zinc-50 dark:text-white text-black dark:border-white/10 border-black/10">
        <SelectItem
          value="ai"
          disabled={board.size === 7}
          title={board.size === 7 ? "AI can not play on 7x7 grid." : ""}
        >
          Play against ChatGPT 🪄
        </SelectItem>
        <SelectItem value="bot">Play against easy bot 🤖</SelectItem>
        <SelectItem value="local">Play locally 🖥️</SelectItem>
        <SelectItem value="multiplayer">Play with a friend 🕹️</SelectItem>
      </SelectContent>
    </Select>
  );
}
