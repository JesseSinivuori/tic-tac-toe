"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import HomeClient, { Board } from "@/app/components/HomeClient";
import { api } from "@/convex/_generated/api";
import {
  getPlayerIdFromLocalStorage,
  setPlayerIdToLocalStorage,
} from "@/app/lib/localStorage";
import { Id } from "@/convex/_generated/dataModel";
import { GameStatus } from "@/app/providers/GameLogicProvider";
import toast from "react-hot-toast";

export type RoomData =
  | {
      _id: string;
      _creationTime: number;
      board: Board;
      currentTurn: string;
      gameStatus: GameStatus;
      player1Id: string;
      player2Id: string | null;
      player1WinStreak: number;
      player2WinStreak: number;
      playerOnWinStreakId: string;
      player1Name: string | null;
      player2Name: string | null;
      waitingForPlayer2ToJoin: boolean;
    }
  | null
  | undefined;

export default function Room({ params: { id } }: { params: { id: string } }) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const inviteLink = `https://tic-tac-toe-x.vercel.app/room/${id}`;
  const [linkCopied, setLinkCopied] = useState(false);
  const roomData: RoomData = useQuery(api.rooms.getRoomById, {
    roomId: id as Id<"rooms">,
  });
  const joinRoom = useMutation(api.rooms.joinRoom);

  useEffect(() => {
    const initialPlayerName = roomData?.player1Id === playerId ? "X" : "O";
    setPlayerName(initialPlayerName);
  }, [playerId, roomData?.player1Id]);

  const getPlayerId = () => {
    const storedPlayerId = getPlayerIdFromLocalStorage();
    if (!storedPlayerId) {
      const newPlayerId = crypto.randomUUID();
      setPlayerIdToLocalStorage(newPlayerId);
      setPlayerId(newPlayerId);
      return newPlayerId;
    } else {
      setPlayerId(storedPlayerId);
      return storedPlayerId;
    }
  };

  useEffect(() => {
    getPlayerId();
  }, []);

  const handleJoinRoom = () => {
    try {
      joinRoom({
        roomId: id as Id<"rooms">,
        playerId: getPlayerId(),
        playerName: playerName,
      });
    } catch (error) {
      throw new Error("Failed to join room.");
    }
  };

  if (roomData === undefined) {
    return (
      <div className="animate-pulse text-black dark:text-white flex flex-1 w-full h-full justify-center items-center">
        Loading room...
      </div>
    );
  }
  if (roomData === null) {
    return (
      <div className="text-black dark:text-white flex flex-1 w-full h-full justify-center items-center">
        Room not found.
      </div>
    );
  }
  if (
    roomData?.waitingForPlayer2ToJoin &&
    roomData.player1Name &&
    playerId === roomData.player1Id
  ) {
    return (
      <div className="animate-pulse text-black dark:text-white flex flex-1 w-full h-full justify-center items-center">
        Waiting for player 2...
      </div>
    );
  }

  if (
    !roomData?.waitingForPlayer2ToJoin &&
    playerId !== roomData?.player1Id &&
    playerId !== roomData?.player2Id
  ) {
    return (
      <div className="text-black dark:text-white flex flex-1 w-full h-full justify-center items-center">
        Room is full.
      </div>
    );
  }

  if (
    !roomData?.waitingForPlayer2ToJoin &&
    roomData.player1Name &&
    roomData.player2Name
  ) {
    return <HomeClient roomData={roomData} playerId={playerId} />;
  }

  if (
    !roomData?.player2Id ||
    (!roomData.player1Name && playerId === roomData.player1Id)
  ) {
    const handleCopyInviteLink = () => {
      try {
        navigator.clipboard
          .writeText(inviteLink)
          .then(() => toast.success("Invite link copied to clipboard!"));
      } catch {
        toast.error("Failed to copy...");
      }
    };
    return (
      <div className=" flex-col text-black dark:text-white flex pt-8 w-full h-full justify-center items-center">
        {!roomData.player1Name && playerId === roomData.player1Id && (
          <div className="flex flex-col justify-center items-center py-8">
            Invite link:{" "}
            <button
              type="button"
              className="dark:text-blue-500 text-blue-700 truncate w-[240px]"
              onClick={handleCopyInviteLink}
            >
              {inviteLink}
            </button>
            {linkCopied && <div>Copied to clipboard!</div>}
          </div>
        )}
        <label htmlFor="name" className="py-4">
          Name
        </label>
        <input
          id="name"
          autoFocus
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="outline-none rounded-md p-2 indent-1 bg-transparent border-black/10 dark:border-white/10 border"
        ></input>
        {!roomData.player1Name && playerId === roomData.player1Id ? (
          <button
            type="button"
            className="mt-4 flex whitespace-nowrap py-2 px-4 dark:bg-green-700 bg-green-600 text-white rounded-md border dark:border-green-700 border-green-600"
            onClick={handleJoinRoom}
          >
            Create Room
          </button>
        ) : (
          <button
            type="button"
            className="mt-4 flex whitespace-nowrap py-2 px-4 dark:bg-green-700 bg-green-600 text-white rounded-md border dark:border-green-700 border-green-600"
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        )}
      </div>
    );
  }

  if (!roomData.player1Name && playerId === roomData.player2Id) {
    return (
      <div className="text-black dark:text-white flex flex-1 w-full h-full justify-center items-center">
        Waiting for player 1...
      </div>
    );
  }
  return (
    <div className="text-black dark:text-white flex flex-1 w-full h-full justify-center items-center">
      Something went wrong.
    </div>
  );
}
