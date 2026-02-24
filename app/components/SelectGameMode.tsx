"use client";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import {
	getPlayerFromLocalStorage,
	setGameModeToLocalStorage,
	setPlayerToLocalStorage,
} from "../lib/localStorage";
import type { GameMode } from "../providers/GameLogicProvider";
import { useUser } from "../providers/UserProvider";
import type { PlayerProps, RoomData } from "../room/[id]/page";
import { type Board, generateBoard } from "./HomeClient";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

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

	const { user } = useUser();

	const handleClickPlayMultiplayer = () => {
		const newBoard = { board: generateBoard(board.size), size: board.size };
		setGameModeToLocalStorage({ gameMode: "MULTIPLAYER" });

		let player: PlayerProps;
		if (user?.id) {
			player = {
				id: user.id,
				name: user.username || "",
			};
		} else {
			player = getPlayerFromLocalStorage();

			if (!player) {
				const newPlayerId = crypto.randomUUID();
				player = {
					id: newPlayerId,
					name: "",
				};
				setPlayerToLocalStorage(player);
			}
		}

		createRoom({ playerId: player.id, board: newBoard }).then((roomId) =>
			router.push(`/room/${roomId}`),
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
			<SelectTrigger className="bg-background w-[220px] border-black/10 text-black dark:border-white/10 dark:text-white">
				<SelectValue placeholder="Opponent" />
			</SelectTrigger>
			<SelectContent className="border-black/10 bg-zinc-50 text-black dark:border-white/10 dark:bg-zinc-950 dark:text-white">
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
