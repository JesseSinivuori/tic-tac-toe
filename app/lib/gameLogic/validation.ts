import { Board } from "@/app/components/HomeClient";
import { Mark } from "./usePlayer";

export const isValidMove = (newBoard: Board, oldBoard: Board, mark: Mark) => {
  let changeCount = 0;
  let changedMark = "";
  let oldMark = "";

  const isValidLength = newBoard.board.length === oldBoard.board.length;

  for (let i = 0; i < newBoard.board.length; i++) {
    if (newBoard.board[i] !== oldBoard.board[i]) {
      changeCount++;
      oldMark = oldBoard.board[i];
      const enemyMark = mark === "X" ? "O" : "X";

      if (oldMark !== enemyMark && oldMark === "E") {
        changedMark = newBoard.board[i];
      }
    }
  }

  const isValidMove =
    isValidLength && changeCount === 1 && changedMark === mark;

  return isValidMove;
};
