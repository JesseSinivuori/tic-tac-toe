"use client";
import { useEffect, useState } from "react";
import SelectGridSize from "./SelectGridSize";
import { Button } from "./ui/button";
import {
  getGameModeFromLocalStorage,
  setGameModeToLocalStorage,
} from "../lib/localStorage";
import {
  checkDraw,
  checkWinner,
  generateMarksToWin,
  generateWinConditions,
} from "../lib/gameLogic/winConditions";
import { Player, usePlayer } from "../lib/gameLogic/usePlayer";
import { getAiTurn, getBotTurn } from "../lib/gameLogic/moves";
import { Board } from "./Board";
import { GameInfo } from "./GameInfo";
import SelectGameMode from "./SelectGameMode";
import { RoomData } from "../room/[id]/page";
import { GameMode, useGameLogicContext } from "../providers/GameLogicProvider";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "../providers/UserProvider";
import ChooseUserName from "./ChooseUserName";
import { LinkComponentButtonRed } from "./ui/link";

export type Board = {
  board: string[];
  size: number;
};

export const generateBoard = (size: number): Board["board"] =>
  Array(size * size).fill("E");

export default function HomeClient({
  roomData,
  playerId,
}: {
  roomData: RoomData;
  playerId?: string | null;
}) {
  const { gameStatus, gameMode, setGameMode } = useGameLogicContext();
  const initialBoard = { board: generateBoard(3), size: 3 };
  const [board, setBoard] = useState<Board>(initialBoard);
  const { player, setPlayer, togglePlayer, toggleTurn, handleWinStreak } =
    usePlayer();
  const { user } = useUser();

  useEffect(() => {
    //Handle joining multiplayer
    if (roomData) {
      setPlayer((prev) => {
        const isPlayer1 = playerId === roomData.player1Id;
        const newPlayer: Player = {
          ...prev,
          player: isPlayer1 ? "X" : "O",
          opponent: isPlayer1 ? "O" : "X",
          winStreak: roomData.player1WinStreak,
          opponentWinStreak: roomData.player2WinStreak,
          turn: isPlayer1 ? "player" : "opponent",
          multiplayerTurn: roomData.currentTurn,
          player1Name: roomData.player1Name ?? "X",
          player2Name: roomData.player2Name ?? "O",
          playerOnWinStreakMultiplayerId: roomData.playerOnWinStreakId,
        };
        return newPlayer;
      });
      setGameModeToLocalStorage({ gameMode: "MULTIPLAYER" });
      setGameMode("MULTIPLAYER");
    }
    if (gameMode === "MULTIPLAYER" && !roomData) {
      setGameModeToLocalStorage({ gameMode: "LOCAL" });
      setGameMode("LOCAL");
    } else {
      const storedGameMode = getGameModeFromLocalStorage();
      setGameMode((storedGameMode as GameMode) ?? "LOCAL");
    }
  }, [gameMode, playerId, roomData, setGameMode, setPlayer]);

  const loginRequired = !user && gameMode === "AI";

  const [aiRetries, setAiRetries] = useState(0);

  const getMarksToWin = () => {
    if (gameMode === "MULTIPLAYER" && roomData) {
      return generateMarksToWin(roomData?.board);
    }
    return generateMarksToWin(board);
  };

  const marksToWin = getMarksToWin();
  const winConditions = generateWinConditions(marksToWin);
  const getWinner = () => {
    let winner;
    if (gameMode === "MULTIPLAYER" && roomData) {
      winner = checkWinner(roomData.board, winConditions, marksToWin)?.winner;
    }
    if (gameMode !== "MULTIPLAYER") {
      winner = checkWinner(board, winConditions, marksToWin)?.winner;
    }
    return winner;
  };
  const winner = getWinner();

  const getDraw = () => {
    if (gameMode === "MULTIPLAYER" && roomData) {
      return checkDraw(roomData.board, winConditions, marksToWin);
    }
    if (gameMode !== "MULTIPLAYER") {
      return checkDraw(board, winConditions, marksToWin);
    }
  };

  const draw = getDraw();
  const gameOver = !!draw || !!winner;

  const GameOver = () => {
    if (winner) {
      const winStreak = player.winStreak || player.opponentWinStreak;
      if (
        gameMode === "LOCAL" ||
        (winner === player.player && gameMode !== "MULTIPLAYER")
      ) {
        return (
          <div className="p-8 text-center text-5xl font-semibold">
            {winner}, you won
            {winStreak > 2 && ` with a ${winStreak} win streak`}! 🥳
          </div>
        );
      }
      if (gameMode === "AI" && winner === player.opponent) {
        return (
          <div className="p-8 text-center text-5xl font-semibold">
            ChatGPT won
            {winStreak > 2 && ` with a ${winStreak} win streak`}! 🪄
          </div>
        );
      }
      if (gameMode === "BOT" && winner === player.opponent) {
        return (
          <div className="p-8 text-center text-5xl font-semibold">
            Bot won
            {winStreak > 2 && ` with a ${winStreak} win streak`}! 🤖
          </div>
        );
      }

      if (gameMode === "MULTIPLAYER" && roomData) {
        const winStreak =
          roomData?.player1WinStreak || roomData?.player2WinStreak;
        return (
          <div className="p-8 text-center text-5xl font-semibold">
            {winner} won
            {winStreak > 2 && ` with a ${winStreak} win streak`}! 🥳
          </div>
        );
      }
    }

    if (draw) {
      return (
        <div className="p-8 text-center text-5xl font-semibold">Draw! </div>
      );
    }
  };

  const resetRoom = useMutation(api.rooms.resetRoom);

  const handlePlayAgain = () => {
    togglePlayer();
    setErrorMessage("");
    const newBoard = { ...board, board: generateBoard(board.size) };
    setBoard(newBoard);
    if (gameMode !== "LOCAL" && player.turn === "opponent") {
      toggleTurn();
      if (gameMode === "AI") {
        return getAiTurn(
          newBoard,
          setBoard,
          player,
          setAiRetries,
          setErrorMessage,
          toggleTurn,
        );
      }
      if (gameMode === "BOT") {
        return getBotTurn(
          newBoard,
          setBoard,
          player,
          winConditions,
          marksToWin,
          handleWinStreak,
          toggleTurn,
        );
      }
    }
    if (gameMode === "MULTIPLAYER") {
      resetRoom({
        board: newBoard,
        roomId: roomData?._id as Id<"rooms">,
      });
    }
  };

  const PlayAgainButton = () => {
    if (gameOver) {
      return (
        <button
          type="button"
          onClick={() => handlePlayAgain()}
          className="flex whitespace-nowrap rounded-md border border-green-500 bg-green-500 px-4 py-2 text-white dark:border-green-600 dark:bg-green-600"
        >
          Play Again
        </button>
      );
    }
  };

  const CurrentPlayer = () => {
    if (gameOver || errorMessage || loginRequired) return null;
    if (gameMode === "AI" && player.turn === "opponent") {
      return (
        <p className="animate-pulse pb-8">
          {`${player.opponent} is thinking${aiRetries <= 1 ? "..." : " "}`}
          {aiRetries > 1 ? `${aiRetries} moves ahead...` : ""}
        </p>
      );
    }
    if (gameMode === "MULTIPLAYER") {
      if (roomData?.currentTurn !== playerId) {
        return (
          <p className="animate-pulse pb-8">
            {`${player.opponent} is thinking...`}
          </p>
        );
      }
      return <p className="pb-8">{`It's your turn ${player.player}.`}</p>;
    }

    return (
      <p className="pb-8">{`It's your turn ${
        player.turn === "player" ? player.player : player.opponent
      }.`}</p>
    );
  };

  const handleClickPlayAgainstAI = () => {
    setGameMode("AI");
    setGameModeToLocalStorage({ gameMode: "AI" });
    const newBoard = { ...board, board: generateBoard(board.size) };
    setBoard(newBoard);
    if (player.turn === "opponent") {
      getAiTurn(
        newBoard,
        setBoard,
        player,
        setAiRetries,
        setErrorMessage,
        toggleTurn,
      );
    }
    setErrorMessage("");
  };

  const handleClickPlayLocally = () => {
    setGameMode("LOCAL");
    setGameModeToLocalStorage({ gameMode: "LOCAL" });
    const newBoard = { ...board, board: generateBoard(board.size) };
    setBoard(newBoard);
    setErrorMessage("");
  };

  const handleClickPlayAgainstBot = () => {
    const newBoard = { ...board, board: generateBoard(board.size) };
    setBoard(newBoard);
    setGameMode("BOT");
    setGameModeToLocalStorage({ gameMode: "BOT" });
    if (player.turn === "opponent") {
      getBotTurn(
        newBoard,
        setBoard,
        player,
        winConditions,
        marksToWin,
        handleWinStreak,
        toggleTurn,
      );
    }

    setErrorMessage("");
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleAiRetry = () => {
    getAiTurn(
      board,
      setBoard,
      player,
      setAiRetries,
      setErrorMessage,
      toggleTurn,
    );
    setErrorMessage("");
  };

  const AIErrorMessage = () => {
    if (errorMessage && gameMode === "AI")
      return (
        <button
          type="button"
          onClick={() => handleAiRetry()}
          className="text-red-600 dark:text-red-500"
        >
          {errorMessage}
        </button>
      );
  };

  const handleRestart = () => {
    togglePlayer();
    const newBoard = { ...board, board: generateBoard(board.size) };
    setBoard(newBoard);
    setErrorMessage("");

    if (gameMode === "AI" && player.turn === "opponent") {
      getAiTurn(
        newBoard,
        setBoard,
        player,
        setAiRetries,
        setErrorMessage,
        toggleTurn,
      );
    }
    if (gameMode === "BOT" && player.turn === "opponent") {
      getBotTurn(
        newBoard,
        setBoard,
        player,
        winConditions,
        marksToWin,
        handleWinStreak,
        toggleTurn,
      );
    }
    if (gameMode === "MULTIPLAYER" && playerId === roomData?.player1Id) {
      resetRoom({
        board: newBoard,
        roomId: roomData?._id as Id<"rooms">,
      });
    }
  };

  const RestartButton = () => (
    <Button
      disabled={playerId !== roomData?.player1Id}
      onClick={() => handleRestart()}
    >
      Restart
    </Button>
  );

  const LeaveRoomButton = () =>
    roomData && (
      <LinkComponentButtonRed href="/" onClick={() => setGameMode("LOCAL")}>
        Leave Room
      </LinkComponentButtonRed>
    );

  const Grid7x7Info = () => {
    if (board.size === 7)
      return <small className="p-2">AI can not play on 7x7 grid.</small>;
  };

  if (user && !user.username) {
    return (
      <ChooseUserName
        className="pt-8"
        closeButtonProps={{
          disabled: true,
          title: "This feature is not implemented yet.",
          children: "Skip",
        }}
      />
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center gap-4 overflow-hidden pt-8">
      <div className="flex w-full flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:items-center">
        <SelectGameMode
          handleClickPlayAgainstAI={handleClickPlayAgainstAI}
          handleClickPlayAgainstBot={handleClickPlayAgainstBot}
          handleClickPlayLocally={handleClickPlayLocally}
          board={board}
          setGameMode={setGameMode}
          gameMode={gameMode}
          playerId={playerId}
          roomData={roomData}
        />
        <SelectGridSize
          setBoard={setBoard}
          generateBoard={generateBoard}
          setGameMode={setGameMode}
          roomData={roomData}
          playerId={playerId}
        />
        <RestartButton />
        <LeaveRoomButton />
      </div>
      <Grid7x7Info />
      <GameInfo
        gameMode={gameMode}
        marksToWin={marksToWin}
        player={player}
        playerId={playerId}
        roomData={roomData}
      />
      <GameOver />
      <PlayAgainButton />
      <Board
        board={board}
        gameOver={gameOver}
        setBoard={setBoard}
        gameMode={gameMode}
        winConditions={winConditions}
        marksToWin={marksToWin}
        player={player}
        toggleTurn={toggleTurn}
        togglePlayer={togglePlayer}
        handleWinStreak={handleWinStreak}
        setAiRetries={setAiRetries}
        setErrorMessage={setErrorMessage}
        roomData={roomData}
        playerId={playerId}
      />
      <CurrentPlayer />
      <AIErrorMessage />
    </div>
  );
}
