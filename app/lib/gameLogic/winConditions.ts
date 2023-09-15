import { Board } from "@/app/components/HomeClient";
import { Mark } from "./usePlayer";

export type MarksToWin = number;
export const generateMarksToWin = (board: Board): MarksToWin => {
  let marksToWin = 3;
  if (board.size === 5) marksToWin = 4;
  if (board.size === 7) marksToWin = 4;
  return marksToWin;
};

export type WinConditions = string[];
export const generateWinConditions = (marksToWin: number): WinConditions =>
  ["X", "O"].map((mark) => Array(marksToWin).fill(mark).join(""));

export type Winner =
  | {
      winner: Mark;
      indices: number[];
    }
  | undefined;

export const checkRowForWin = (
  board: Board,
  winConditions: WinConditions,
  marksToWin: MarksToWin
): Winner => {
  for (let i = 0; i < board.size; i++) {
    const row = board.board
      .slice(i * board.size, (i + 1) * board.size)
      .join("");

    for (const condition of winConditions) {
      const startIdxInRow = row.indexOf(condition);
      if (startIdxInRow !== -1) {
        const startIdx = startIdxInRow + i * board.size;
        const indices = Array.from(
          { length: marksToWin },
          (_, j) => startIdx + j
        );

        return { winner: condition[0] as Mark, indices: indices };
      }
    }
  }
};

export const checkColumnForWin = (
  board: Board,
  winConditions: WinConditions,
  marksToWin: MarksToWin
): Winner => {
  for (let i = 0; i < board.size; i++) {
    const col = Array.from(
      { length: board.size },
      (_, j) => board.board[i + j * board.size]
    ).join("");

    for (const condition of winConditions) {
      const startIdxInCol = col.indexOf(condition);
      if (startIdxInCol !== -1) {
        const startIdx = i + startIdxInCol * board.size;
        const indices = Array.from(
          { length: marksToWin },
          (_, j) => startIdx + j * board.size
        );

        return { winner: condition[0] as Mark, indices: indices };
      }
    }
  }
};

export const checkDiagonals = (
  rowStart: number,
  colStart: number,
  rowStep: number,
  colStep: number,
  board: Board,
  marksToWin: MarksToWin,
  winConditions: WinConditions
): Winner => {
  let diag = "";
  const indices: number[] = [];
  for (
    let i = 0;
    rowStart + i * rowStep < board.size && colStart + i * colStep < board.size;
    i++
  ) {
    const index =
      (rowStart + i * rowStep) * board.size + (colStart + i * colStep);
    diag += board.board[index];
    indices.push(index);

    if (diag.length >= marksToWin) {
      for (const condition of winConditions) {
        const startIdxInDiag = diag.indexOf(condition);
        if (startIdxInDiag !== -1) {
          const winningIndices = indices.slice(
            startIdxInDiag,
            startIdxInDiag + marksToWin
          );
          return { winner: condition[0] as Mark, indices: winningIndices };
        }
      }
    }
  }
};

export const checkDiagonalsForWin = (
  board: Board,
  winConditions: WinConditions,
  marksToWin: MarksToWin
): Winner => {
  for (let row = 0; row <= board.size - marksToWin; row++) {
    for (let col = 0; col <= board.size - marksToWin; col++) {
      const topLeftToBottomRight = checkDiagonals(
        row,
        col,
        1,
        1,
        board,
        marksToWin,
        winConditions
      );
      if (topLeftToBottomRight) return topLeftToBottomRight;

      const bottomLeftToTopRight = checkDiagonals(
        board.size - 1 - row,
        col,
        -1,
        1,
        board,
        marksToWin,
        winConditions
      );
      if (bottomLeftToTopRight) return bottomLeftToTopRight;
    }
  }
};

export const checkWinner = (
  board: Board,
  winConditions: WinConditions,
  marksToWin: MarksToWin
): Winner => {
  const winner =
    checkRowForWin(board, winConditions, marksToWin) ||
    checkColumnForWin(board, winConditions, marksToWin) ||
    checkDiagonalsForWin(board, winConditions, marksToWin);

  return winner;
};

export type Draw = boolean;
const checkBoardIsFull = (board: Board) =>
  board.board.every((value) => value !== "E");

export const checkDraw = (
  board: Board,
  winConditions: WinConditions,
  marksToWin: MarksToWin
): Draw => {
  const draw =
    checkBoardIsFull(board) && !!!checkWinner(board, winConditions, marksToWin);

  return draw;
};
