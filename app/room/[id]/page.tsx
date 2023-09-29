"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import HomeClient, { Board } from "@/app/components/HomeClient";
import { api } from "@/convex/_generated/api";
import {
  getPlayerFromLocalStorage,
  setPlayerToLocalStorage,
} from "@/app/lib/localStorage";
import { Id } from "@/convex/_generated/dataModel";
import { GameStatus } from "@/app/providers/GameLogicProvider";
import toast from "react-hot-toast";
import { useUser } from "@/app/providers/UserProvider";
import { InputWithLabel } from "@/app/components/ui/inputWithLabel";
import { ButtonGreen } from "@/app/components/ui/button";
import ChooseUserName from "@/app/components/ChooseUserName";

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

type RoomProps = {
  params: {
    id: string;
  };
};

export type PlayerProps =
  | {
      id: string;
      name: string;
    }
  | null
  | undefined;

export default function Room({ params: { id } }: RoomProps) {
  const { user } = useUser();

  const [player, setPlayer] = useState<PlayerProps>(null);
  console.log("🚀 ~ file: page.tsx:55 ~ Room ~ player:", player);

  const playerNameRef = useRef<HTMLInputElement>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const inviteLink = `${baseUrl}/room/${id}`;
  const roomData: RoomData = useQuery(api.rooms.getRoomById, {
    roomId: id as Id<"rooms">,
  });

  const joinRoom = useMutation(api.rooms.joinRoom);
  console.log(roomData);
  useEffect(() => {
    if (user && user?.username && user.id) {
      const newPlayer = {
        id: user.id,
        name: user.username,
      };
      setPlayer(newPlayer);
    }
  }, [user]);

  useEffect(() => {
    if (roomData && !user) {
      const storedPlayer = getPlayerFromLocalStorage();

      setPlayer(storedPlayer);
    }
  }, [roomData, user]);

  const getPlayer = (): PlayerProps => {
    if (user && user.id && user.username) {
      const player = {
        id: user.id,
        name: user.username,
      };
      setPlayer(player);
      return player;
    }

    if (!user) {
      const storedPlayer = getPlayerFromLocalStorage();

      let player = { ...storedPlayer };

      if (!player.id) {
        player.id = crypto.randomUUID();
      }

      if (!player.name) {
        player.name =
          playerNameRef.current?.value ||
          (player.id === roomData?.player1Id ? "X" : "O");
      }

      setPlayerToLocalStorage(player);
      setPlayer(player);

      return player;
    }
  };

  const handleJoinRoom = async () => {
    try {
      const player = getPlayer();

      if (!player) {
        throw new Error("Player was not found.");
      }

      await joinRoom({
        roomId: id as Id<"rooms">,
        playerId: player.id,
        playerName: player.name,
      });
    } catch (error) {
      throw new Error("Failed to join room.");
    }
  };

  if (roomData === undefined) {
    return (
      <div className="flex h-full w-full flex-1 animate-pulse items-center justify-center pt-8 text-black dark:text-white">
        Loading room...
      </div>
    );
  }
  if (roomData === null) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center pt-8 text-black dark:text-white">
        Room not found.
      </div>
    );
  }

  if (
    player?.id !== roomData?.player1Id &&
    player?.id !== roomData?.player2Id &&
    roomData?.player1Name &&
    roomData?.player2Name
  ) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center pt-8 text-black dark:text-white">
        Room is full.
      </div>
    );
  }

  const NameInput = () => (
    <InputWithLabel
      inputProps={{
        id: "name",
        placeholder: "Name",
        type: "text",
        ref: playerNameRef,
      }}
      labelProps={{ children: "Name", htmlFor: "name" }}
    />
  );

  const handleCopyInviteLink = () => {
    try {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => toast.success("Invite link copied to clipboard!"));
    } catch {
      toast.error("Failed to copy...");
    }
  };

  const InviteLink = () => (
    <div className="flex flex-col items-center justify-center py-8">
      Invite link:{" "}
      <button
        type="button"
        className="w-[240px] truncate text-blue-700 dark:text-blue-500"
        onClick={handleCopyInviteLink}
      >
        {inviteLink}
      </button>
    </div>
  );

  const CreateRoomButton = () => (
    <ButtonGreen type="button" className="mt-4" onClick={handleJoinRoom}>
      Create Room
    </ButtonGreen>
  );

  const JoinRoomButton = () => (
    <ButtonGreen type="button" className="mt-4" onClick={handleJoinRoom}>
      Join Room
    </ButtonGreen>
  );

  if (user && !user?.username) {
    return <ChooseUserName />;
  }

  if (roomData.player1Id === user?.id && !player?.name) {
    if (!user.username) {
      return (
        <>
          <InviteLink />
          <NameInput />
          <CreateRoomButton />
        </>
      );
    }
    return (
      <>
        <InviteLink />
        <CreateRoomButton />
      </>
    );
  }

  if (player?.id === roomData.player1Id && !roomData.player1Name) {
    return (
      <div className=" flex h-full w-full flex-col items-center justify-center pt-8 text-black dark:text-white">
        <InviteLink />
        {!roomData.player1Name && !user && <NameInput />}
        <JoinRoomButton />
      </div>
    );
  }

  if (player?.id !== roomData.player1Id && roomData.waitingForPlayer2ToJoin) {
    return (
      <div className=" flex h-full w-full flex-col items-center justify-center pt-8 text-black dark:text-white">
        {!roomData.player2Name && !user && <NameInput />}
        <JoinRoomButton />
      </div>
    );
  }

  if (!roomData.player2Name && roomData.player1Id === player?.id) {
    return (
      <div className="flex h-full w-full flex-1 animate-pulse items-center justify-center pt-8 text-black dark:text-white">
        Waiting for player 2...
      </div>
    );
  }

  if (!roomData.player1Name && player?.id === roomData.player2Id) {
    return (
      <div className="flex h-full w-full flex-1 animate-pulse items-center justify-center pt-8 text-black dark:text-white">
        Waiting for player 1...
      </div>
    );
  }

  if (
    roomData?.player1Name &&
    roomData?.player2Name &&
    !roomData.waitingForPlayer2ToJoin
  ) {
    return <HomeClient roomData={roomData} playerId={player?.id} />;
  }

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center pt-8 text-black dark:text-white">
      Something went wrong.
    </div>
  );
}
