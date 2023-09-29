import { Session } from "next-auth";
import { MarksToWin } from "../lib/gameLogic/winConditions";
import { GameMode } from "../providers/GameLogicProvider";
import { Player, usePlayer } from "../lib/gameLogic/usePlayer";
import { RoomData } from "../room/[id]/page";
import { useUser } from "../providers/UserProvider";

export const GameInfo = ({
  gameMode,
  marksToWin,
  player,
  playerId,
  roomData,
}: {
  gameMode: GameMode;
  marksToWin: MarksToWin;
  player: Player;
  playerId: string | null | undefined;
  roomData: RoomData;
}) => {
  const { user } = useUser();
  if (gameMode === "AI") {
    if (!user)
      return (
        <>
          <p className="p-2">Please sign in to play against ChatGPT.</p>
        </>
      );
    return (
      <p className="p-2">
        Playing against ChatGPT. Place {marksToWin} in a row to win.
      </p>
    );
  }
  if (gameMode === "BOT") {
    return (
      <p className="p-2">
        Playing against bot. Place {marksToWin} in a row to win.
      </p>
    );
  }
  if (gameMode === "MULTIPLAYER") {
    return (
      <p className="p-2">
        Playing with{" "}
        {playerId === roomData?.player1Id
          ? player.player2Name
          : player.player1Name}
        . Place {marksToWin} in a row to win.
      </p>
    );
  }
  return (
    <p className="p-2">Playing locally. Place {marksToWin} in a row to win.</p>
  );
};
