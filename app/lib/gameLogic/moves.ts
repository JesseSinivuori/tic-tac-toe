import { Board } from "@/app/components/HomeClient";
import { Mark, Player, Turn } from "./usePlayer";
import { isValidMove } from "./validation";
import { MarksToWin, WinConditions, checkWinner } from "./winConditions";

export const checkLastPossibleMove = (
  board: Board,
  setBoard: React.Dispatch<React.SetStateAction<Board>>,
  player: Player
) => {
  const oneMoveLeft = board.board.filter((x) => x === "E").length === 1;
  const lastMoveIndex = board.board.indexOf("E");

  if (lastMoveIndex !== -1 && player.turn === "opponent" && oneMoveLeft) {
    const newBoard = { ...board, board: [...board.board] };
    newBoard.board[lastMoveIndex] = player.opponent;
    setBoard(newBoard);
    return true;
  }
  return false;
};

export const getBotTurn = (
  board: Board,
  setBoard: React.Dispatch<React.SetStateAction<Board>>,
  player: Player,
  winConditions: WinConditions,
  marksToWin: MarksToWin,
  handleWinStreak: (winner?: Mark, draw?: boolean) => Player,
  toggleTurn: () => Player
) => {
  const lastMovePossibleMove = checkLastPossibleMove(board, setBoard, player);
  if (lastMovePossibleMove) return;

  const newBoard = { ...board, board: [...board.board] };

  const emptyIndices = newBoard.board
    .map((val, idx) => (val === "E" ? idx : -1))
    .filter((idx) => idx !== -1);

  const generateRandomMarkIndex = () =>
    Math.floor(Math.random() * newBoard.board.length);
  let isValid = false;
  let randomMarkIndex = generateRandomMarkIndex();

  while (!emptyIndices.includes(randomMarkIndex)) {
    randomMarkIndex = generateRandomMarkIndex();
    if (emptyIndices.length === 0) return;
  }

  newBoard.board[randomMarkIndex] = player.opponent;
  isValid = isValidMove(newBoard, board, player.opponent);

  if (!isValid) {
    newBoard.board[randomMarkIndex] = "E";
    throw new Error("not valid move");
  }

  if (isValid) {
    toggleTurn();
    setBoard(newBoard);

    const winner = checkWinner(newBoard, winConditions, marksToWin)?.winner;
    if (winner) {
      handleWinStreak(winner);
    }
  }
};

export const getAiTurn = async (
  board: Board,
  setBoard: React.Dispatch<React.SetStateAction<Board>>,
  player: Player,
  setAiRetries: React.Dispatch<React.SetStateAction<number>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  toggleTurn: () => Player
) => {
  const lastMovePossibleMove = checkLastPossibleMove(board, setBoard, player);
  if (lastMovePossibleMove) return;
  const retries = 6;
  for (let i = 0; i < retries; i++) {
    try {
      setAiRetries(i);
      let isValid = false;
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player, board }),
      });

      if (res.status === 429) {
        return setErrorMessage("Too many requests. Click here to try again.");
      }

      const body: string | undefined = await res.json();

      const newBoardArray = body?.split(",") ?? [];
      const newBoard = { ...board, board: [...newBoardArray] };

      isValid = isValidMove(newBoard, board, player.opponent);

      if (isValid) {
        setBoard(newBoard);
        toggleTurn();
        break;
      }
      if (i >= retries - 1 && !isValid) throw new Error();
    } catch {
      setErrorMessage("AI failed to make a turn. Click here to try again.");
    }
  }
};
