"use client";
import { getAiTurn, getBotTurn } from "../lib/gameLogic/moves";
import { Player, Mark } from "../lib/gameLogic/usePlayer";
import {
  MarksToWin,
  WinConditions,
  checkDraw,
  checkWinner,
} from "../lib/gameLogic/winConditions";
import { Board } from "./HomeClient";
import { launchFireWorks } from "../lib/fireWorks";
import { RoomData } from "../room/[id]/page";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GameMode, useGameLogicContext } from "../providers/GameLogicProvider";

export const Square = ({
  index,
  board,
  gameOver,
  setBoard,
  gameMode,
  winConditions,
  marksToWin,
  player,
  toggleTurn,
  handleWinStreak,
  setAiRetries,
  setErrorMessage,
  roomData,
  playerId,
}: {
  index: number;
  board: Board;
  gameOver: boolean;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  gameMode: GameMode;
  winConditions: WinConditions;
  marksToWin: MarksToWin;
  player: Player;
  toggleTurn: () => Player;
  handleWinStreak: (winner?: Mark, draw?: boolean) => Player;
  setAiRetries: React.Dispatch<React.SetStateAction<number>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  roomData: RoomData;
  playerId?: string | null;
}) => {
  const { setGameStatus, gameStatus } = useGameLogicContext();
  const gameIsNotOver = board.board[index] === "E" && !gameOver;
  const canClickNotMultiplayer =
    gameIsNotOver && player.turn === "player" && gameMode !== "MULTIPLAYER";
  const canClickLocal = gameIsNotOver && gameMode === "LOCAL";
  const canClickMultiplayer =
    gameIsNotOver && roomData?.currentTurn === playerId;
  const canClick =
    canClickNotMultiplayer || canClickLocal || canClickMultiplayer;
  const makeTurn = useMutation(api.rooms.makeTurn);
  const handleMultiplayerWinner = useMutation(api.rooms.winner);
  const handleMultiplayerDraw = useMutation(api.rooms.draw);

  const handleMultiplayer = async () => {
    if (!roomData) throw new Error("roomData was not found.");
    if (roomData?.currentTurn === playerId) {
      const newBoard = await makeTurn({
        index: index,
        playerId: playerId,
        roomId: roomData._id as Id<"rooms">,
      });
      if (newBoard) {
        return newBoard;
      } else {
        throw new Error("Failed to make turn.");
      }
    }
  };

  const handleClick = async () => {
    if (canClick) {
      if (gameStatus !== "ongoing") setGameStatus("ongoing");

      let newBoard = { ...board, board: [...board.board] };

      newBoard.board[index] =
        player.turn === "player" ? player.player : player.opponent;
      if (gameMode !== "MULTIPLAYER") {
        setBoard(newBoard);
      }

      if (gameMode === "MULTIPLAYER") {
        newBoard = (await handleMultiplayer()) ?? board;
      }
      toggleTurn();

      const draw = checkDraw(newBoard, winConditions, marksToWin);
      const winner = checkWinner(newBoard, winConditions, marksToWin)?.winner;

      if (!draw && !winner && gameMode !== "LOCAL") {
        if (gameMode === "AI") {
          await getAiTurn(
            newBoard,
            setBoard,
            player,
            setAiRetries,
            setErrorMessage,
            toggleTurn
          );
        }
        if (gameMode === "BOT") {
          getBotTurn(
            newBoard,
            setBoard,
            player,
            winConditions,
            marksToWin,
            handleWinStreak,
            toggleTurn
          );
        }
      }

      if (winner) {
        const playerWithNewWinStreak = handleWinStreak(winner);
        launchFireWorks(playerWithNewWinStreak, gameMode);
        setGameStatus("won");
        if (roomData && playerId && gameMode === "MULTIPLAYER") {
          handleMultiplayerWinner({
            roomId: roomData?._id as Id<"rooms">,
            playerId: playerId,
          });
        }
      }
      if (draw) {
        handleWinStreak(undefined, draw);
        setGameStatus("draw");
        if (roomData && playerId && gameMode === "MULTIPLAYER") {
          handleMultiplayerDraw({
            roomId: roomData?._id as Id<"rooms">,
            playerId: playerId,
          });
        }
      }
    }
  };

  const winnerObject = checkWinner(board, winConditions, marksToWin);
  const winner = winnerObject?.winner;
  const winnerIndices = winnerObject?.indices;

  const getWinnerHighlight = () => {
    if (winner) {
      if (winnerIndices?.includes(index)) {
        if (player.player !== winner && gameMode !== "LOCAL") {
          return "dark:bg-red-600 bg-red-500 text-white dark:border-red-600 border-red-500";
        } else {
          return "dark:bg-green-600 bg-green-500 text-white dark:border-green-600 border-green-500";
        }
      }
    }
    return "";
  };

  const handleArrowKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    let newIndex;
    const currentSquareIndex = parseInt(e.currentTarget.id.split("-")[1]);

    switch (e.key) {
      case "ArrowUp":
        newIndex = currentSquareIndex - board.size;
        break;
      case "ArrowDown":
        newIndex = currentSquareIndex + board.size;
        break;
      case "ArrowLeft":
        newIndex = currentSquareIndex - 1;
        break;
      case "ArrowRight":
        newIndex = currentSquareIndex + 1;
        break;
      default:
        return;
    }

    // Check if the new index is out of bounds
    if (newIndex >= 0 && newIndex < board.size * board.size) {
      // Move focus to the next square
      document.getElementById(`square-${newIndex}`)?.focus();
    }
  };
  const waitingForOpponent =
    player.turn === "opponent" &&
    gameMode !== "LOCAL" &&
    board.board[index] === "E";
  const waitingForOpponentMultiplayer =
    board.board[index] === "E" && playerId !== roomData?.currentTurn;
  return (
    <button
      id={`square-${index}`}
      className={`${getWinnerHighlight()} ${
        canClick ? "cursor-pointer hover:bg-zinc-500/10" : "cursor-default"
      }
       ${
         waitingForOpponent ||
         (waitingForOpponentMultiplayer && "animate-pulse")
       } border ${
        !winnerIndices?.includes(index) &&
        "dark:border-white/20 border-zinc-950/20"
      } sm:m-2 m-1 flex items-center rounded-md justify-center font-medium text-[40px] w-[80px] h-[80px]`}
      onClick={() => handleClick()}
      onKeyDown={(e) => handleArrowKeyPress(e)}
    >
      {board.board[index] !== "E" && board.board[index]}
    </button>
  );
};
