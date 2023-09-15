import { Session } from "next-auth";
import SignInButton from "./SignInButton";
import { Square } from "./Square";
import type { Board as TBoard } from "./HomeClient";
import { MarksToWin, WinConditions } from "../lib/gameLogic/winConditions";
import { Mark, Player } from "../lib/gameLogic/usePlayer";
import { RoomData } from "../room/[id]/page";
import { GameMode } from "../providers/GameLogicProvider";

export const Board = ({
  session,
  board,
  gameOver,
  setBoard,
  gameMode,
  winConditions,
  marksToWin,
  player,
  toggleTurn,
  togglePlayer,
  handleWinStreak,
  setAiRetries,
  setErrorMessage,
  roomData,
  playerId,
}: {
  session: Session | null;
  board: TBoard;
  gameOver: boolean;
  setBoard: React.Dispatch<React.SetStateAction<TBoard>>;
  gameMode: GameMode;
  winConditions: WinConditions;
  marksToWin: MarksToWin;
  player: Player;
  toggleTurn: () => Player;
  togglePlayer: () => Player;
  handleWinStreak: (winner?: Mark, draw?: boolean) => Player;
  setAiRetries: React.Dispatch<React.SetStateAction<number>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  roomData: RoomData;
  playerId?: string | null;
}) => {
  if (!session && gameMode === "AI") {
    return <SignInButton />;
  }

  const getBoard = () => {
    let newBoard = board;
    if (gameMode === "MULTIPLAYER") {
      newBoard = roomData?.board ?? board;
      return newBoard;
    }
    return newBoard;
  };

  return (
    <div className="flex items-center overflow-auto py-8">
      <div
        className={`grid flex-none`}
        style={{
          gridTemplateColumns: `repeat(${board.size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${board.size}, minmax(0, 1fr))`,
          aspectRatio: 1 / 1,
        }}
      >
        {getBoard().board.map((_square, i) => (
          <Square
            key={i}
            index={i}
            board={getBoard()}
            gameOver={gameOver}
            setBoard={setBoard}
            gameMode={gameMode}
            winConditions={winConditions}
            marksToWin={marksToWin}
            player={player}
            toggleTurn={toggleTurn}
            handleWinStreak={handleWinStreak}
            setAiRetries={setAiRetries}
            setErrorMessage={setErrorMessage}
            roomData={roomData}
            playerId={playerId}
          />
        ))}
      </div>
    </div>
  );
};
