"use client";
import { useCallback, useState } from "react";
import SelectGridSize from "./components/SelectGridSize";
import Button from "./components/ui/button";
import { fire } from "./lib/confetti";
import SelectPlayMode from "./components/SelectPlayMode";

export type CurrentPlayerProps = {
  mark: "X" | "O";
  human: boolean;
};

export default function App() {
  const [size, setSize] = useState(3);
  const generateBoard = (size: number) =>
    Array(size * size).fill("E") as string[];
  const [board, setBoard] = useState<string[]>(generateBoard(size));
  const [isPlayingAgainstAi, setIsPlayingAgainstAi] = useState(true);
  const [isPlayingAgainstBot, setIsPlayingAgainstBot] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayerProps>({
    mark: "X",
    human: true,
  });

  const isValidMove = (
    newBoard: string[],
    oldBoard: string[],
    currentPlayer: CurrentPlayerProps
  ) => {
    let changeCount = 0;
    let changedMark = "";
    let oldMark = "";

    const isValidLength = newBoard.length === oldBoard.length;

    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] !== oldBoard[i]) {
        changeCount++;
        oldMark = oldBoard[i];
        const enemyMark = currentPlayer.mark === "X" ? "O" : "X";

        if (oldMark !== enemyMark && oldMark === "E") {
          changedMark = newBoard[i];
        }
      }
    }

    const isValidMove =
      isValidLength && changeCount === 1 && changedMark === currentPlayer.mark;

    return isValidMove;
  };

  const [aiRetries, setAiRetries] = useState(0);

  const getAiTurn = async (
    board: string[],
    currentPlayer: CurrentPlayerProps
  ) => {
    const retries = 6;
    for (let i = 0; i < retries; i++) {
      try {
        setAiRetries(i);
        let isValid = false;
        const currentBoard = [...board];
        const res = await fetch("/api/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPlayer, board, size }),
        });

        const body = await res.json();

        const newBoard = body?.split(",") ?? [];

        isValid = isValidMove(newBoard, board, currentPlayer);
        if (isValid && currentBoard.map((x) => board.includes(x))) {
          setBoard(newBoard);

          setCurrentPlayer({
            human: true,
            mark: currentPlayer.mark === "X" ? "O" : "X",
          });

          break;
        }
        if (i >= retries - 1 && !isValid) throw new Error();
      } catch {
        setErrorMessage("AI failed to make a turn. Click here to try again.");
      }
    }
  };

  const getBotTurn = (
    board: string[],
    newCurrentPlayer: CurrentPlayerProps
  ) => {
    const newBoard = [...board];
    const emptyIndices = newBoard
      .map((val, idx) => (val === "E" ? idx : -1))
      .filter((idx) => idx !== -1);

    const generateRandomMark = () => Math.ceil(Math.random() * board.length);
    let isValid = false;
    let randomMarkIndex = 0;

    randomMarkIndex = generateRandomMark();
    while (!emptyIndices.includes(randomMarkIndex)) {
      randomMarkIndex = generateRandomMark();
    }

    newBoard[randomMarkIndex] = newCurrentPlayer.mark;

    isValid = isValidMove(newBoard, board, newCurrentPlayer);

    if (!isValid) {
      newBoard[randomMarkIndex] = "E";
    }

    if (isValid) {
      setBoard(newBoard);
      setCurrentPlayer({
        human: true,
        mark: newCurrentPlayer.mark === "X" ? "O" : "X",
      });
    }
  };

  const Square = ({ index }: { index: number }) => {
    const canClick = board[index] === "E" && !gameOver && currentPlayer.human;

    const handleClick = () => {
      if (canClick) {
        const newBoard = [...board];
        newBoard[index] = currentPlayer.mark;

        setBoard(newBoard);

        if (!isPlayingAgainstAi) {
          const newCurrentPlayer: CurrentPlayerProps =
            currentPlayer.mark !== "X"
              ? { mark: "X", human: true }
              : { mark: "O", human: true };
          setCurrentPlayer(newCurrentPlayer);
        }
        const gameOver = checkGameOver(newBoard);
        const winner = checkWinner(newBoard);

        if (isPlayingAgainstAi && !gameOver && !winner) {
          const newCurrentPlayer: CurrentPlayerProps =
            currentPlayer.mark !== "X"
              ? { mark: "X", human: false }
              : { mark: "O", human: false };
          setCurrentPlayer(newCurrentPlayer);

          getAiTurn(newBoard, newCurrentPlayer);
        }

        if (isPlayingAgainstBot && !gameOver && !winner) {
          const newCurrentPlayer: CurrentPlayerProps =
            currentPlayer.mark !== "X"
              ? { mark: "X", human: false }
              : { mark: "O", human: false };
          setCurrentPlayer(newCurrentPlayer);

          getBotTurn(newBoard, newCurrentPlayer);
        }
        if (winner && currentPlayer.human) {
          fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
          });
        }
      }
    };

    return (
      <button
        className={`${
          winnerIndices?.includes(index) &&
          currentPlayer.human &&
          "bg-green-600"
        } ${
          winnerIndices?.includes(index) &&
          (isPlayingAgainstAi || isPlayingAgainstBot) &&
          currentPlayer.human &&
          "bg-red-600"
        } ${
          canClick ? "cursor-pointer hover:bg-zinc-800/50" : "cursor-default"
        } ${
          !currentPlayer.human && board[index] === "E" && "animate-pulse"
        } border border-white/20 sm:m-2 m-1 flex items-center rounded-md justify-center sm:text-[40px] text-[32px] sm:w-[80px] sm:h-[80px] w-[60px] h-[60px]`}
        onClick={() => handleClick()}
      >
        {board[index] !== "E" && board[index]}
      </button>
    );
  };

  const generateMarksToWin = () => {
    let marksToWin = 3;
    if (size === 5) marksToWin = 4;
    if (size === 7) marksToWin = 4;
    return marksToWin;
  };
  const marksToWin = generateMarksToWin();

  const generateWinConditions = () =>
    ["X", "O"].map((mark) => Array(marksToWin).fill(mark).join(""));

  const winConditions = generateWinConditions();

  const winRow = useCallback(
    (board: string[]) => {
      for (let i = 0; i < size; i++) {
        const row = board.slice(i * size, (i + 1) * size).join("");

        for (const condition of winConditions) {
          const startIdxInRow = row.indexOf(condition);
          if (startIdxInRow !== -1) {
            const startIdx = startIdxInRow + i * size;
            const indices = Array.from(
              { length: marksToWin },
              (_, j) => startIdx + j
            );

            return { winner: condition[0], indices };
          }
        }
      }
    },
    [marksToWin, size, winConditions]
  );

  const winColumn = useCallback(
    (board: string[]) => {
      for (let i = 0; i < size; i++) {
        const col = Array.from(
          { length: size },
          (_, j) => board[i + j * size]
        ).join("");

        for (const condition of winConditions) {
          const startIdxInCol = col.indexOf(condition);
          if (startIdxInCol !== -1) {
            const startIdx = i + startIdxInCol * size;
            const indices = Array.from(
              { length: marksToWin },
              (_, j) => startIdx + j * size
            );

            return { winner: condition[0], indices };
          }
        }
      }
    },
    [marksToWin, size, winConditions]
  );

  const checkDiagonal = useCallback(
    (
      rowStart: number,
      colStart: number,
      rowStep: number,
      colStep: number,
      board: string[]
    ) => {
      let diag = "";
      const indices: number[] = [];
      for (
        let i = 0;
        rowStart + i * rowStep < size && colStart + i * colStep < size;
        i++
      ) {
        const index =
          (rowStart + i * rowStep) * size + (colStart + i * colStep);
        diag += board[index];
        indices.push(index);

        if (diag.length >= marksToWin) {
          for (const condition of winConditions) {
            const startIdxInDiag = diag.indexOf(condition);
            if (startIdxInDiag !== -1) {
              const winningIndices = indices.slice(
                startIdxInDiag,
                startIdxInDiag + marksToWin
              );
              return { winner: condition[0], indices: winningIndices };
            }
          }
        }
      }
    },
    [marksToWin, size, winConditions]
  );

  const winDiagonal = useCallback(
    (board: string[]) => {
      for (let row = 0; row <= size - marksToWin; row++) {
        for (let col = 0; col <= size - marksToWin; col++) {
          const topLeftToBottomRight = checkDiagonal(row, col, 1, 1, board);
          if (topLeftToBottomRight) return topLeftToBottomRight;

          const bottomLeftToTopRight = checkDiagonal(
            size - 1 - row,
            col,
            -1,
            1,
            board
          );
          if (bottomLeftToTopRight) return bottomLeftToTopRight;
        }
      }
    },
    [checkDiagonal, marksToWin, size]
  );

  const checkWinner = useCallback(
    (board: string[]) =>
      winRow(board)?.winner ||
      winColumn(board)?.winner ||
      winDiagonal(board)?.winner,
    [winColumn, winDiagonal, winRow]
  );
  const winner = checkWinner(board);

  const checkWinnerIndices = (board: string[]) =>
    winRow(board)?.indices ||
    winColumn(board)?.indices ||
    winDiagonal(board)?.indices;
  const winnerIndices = checkWinnerIndices(board);

  const checkGameOver = (board: string[]) =>
    board.every((value) => value !== "E");
  const gameOver = checkGameOver(board) || checkWinner(board);

  const GameOver = () => {
    if (winner && currentPlayer.human) {
      return <div className="text-5xl p-8 font-semibold">{winner} won! 🥳</div>;
    }
    if (gameOver) {
      return <div className="text-5xl p-8 font-semibold">Draw! </div>;
    }
  };

  const handlePlayAgain = () => {
    const newBoard = generateBoard(size);
    setBoard(newBoard);

    if (isPlayingAgainstAi) {
      const newCurrentPlayer = {
        ...currentPlayer,
        human: currentPlayer.human ? false : true,
      };
      setCurrentPlayer(newCurrentPlayer);
      getAiTurn(newBoard, newCurrentPlayer);
      setErrorMessage("");
    }
  };

  const PlayAgainButton = () => {
    if (gameOver) {
      return (
        <Button
          onClick={() => handlePlayAgain()}
          className="hover:bg-green-600"
        >
          Play Again
        </Button>
      );
    }
  };

  const CurrentPlayer = () => {
    if (gameOver || errorMessage) return null;
    if (isPlayingAgainstAi && !currentPlayer.human) {
      return (
        <p className="pb-8 animate-pulse">
          {currentPlayer.mark} is thinking{aiRetries <= 1 ? "..." : " "}
          {aiRetries > 1 ? `${aiRetries} moves ahead...` : ""}
        </p>
      );
    }

    return <p className="pb-8">{`It's your turn ${currentPlayer.mark}.`}</p>;
  };

  const handleClickPlayAgainstAI = () => {
    if (isPlayingAgainstAi) setCurrentPlayer({ ...currentPlayer, human: true });
    setIsPlayingAgainstAi(true);
    setIsPlayingAgainstBot(false);
    const newBoard = generateBoard(size);
    setBoard(newBoard);
    setErrorMessage("");
  };

  const handleClickPlayLocally = () => {
    setCurrentPlayer({ ...currentPlayer, human: true });
    setIsPlayingAgainstAi(false);
    setIsPlayingAgainstBot(false);
    const newBoard = generateBoard(size);
    setBoard(newBoard);
    setErrorMessage("");
  };

  const handleClickPlayAgainstBot = () => {
    setIsPlayingAgainstAi(false);
    setIsPlayingAgainstBot(true);
    if (!currentPlayer.human) getBotTurn(board, currentPlayer);
    const newBoard = generateBoard(size);
    setBoard(newBoard);
    setErrorMessage("");
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleAiRetry = () => {
    getAiTurn(board, currentPlayer);
    setErrorMessage("");
  };

  const AIErrorMessage = () => {
    if (errorMessage && isPlayingAgainstAi)
      return (
        <button
          type="button"
          onClick={() => handleAiRetry()}
          className="text-red-600"
        >
          {errorMessage}
        </button>
      );
  };

  const handleRestart = () => {
    setBoard(generateBoard(size));
    setErrorMessage("");
    if (isPlayingAgainstAi && !currentPlayer.human) {
      getAiTurn(board, currentPlayer);
    }
  };
  const RestartButton = () => (
    <Button onClick={() => handleRestart()}>Restart</Button>
  );

  const Grid7x7Info = () => {
    if (size === 7)
      return <small className="p-2">AI can not play on 7x7 grid.</small>;
  };

  const GameInfo = () => {
    if (isPlayingAgainstAi) {
      return (
        <p className="p-2">
          Playing against AI. Place {marksToWin} in a row to win.
        </p>
      );
    }
    if (isPlayingAgainstBot) {
      return (
        <p className="p-2">
          Playing against bot. Place {marksToWin} in a row to win.
        </p>
      );
    }
    return (
      <p className="p-2">
        Playing locally. Place {marksToWin} in a row to win.
      </p>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center pt-8 gap-4 h-full w-full overflow-hidden">
      <div className="flex gap-4 justify-center items-center">
        <SelectGridSize
          setSize={setSize}
          setBoard={setBoard}
          generateBoard={generateBoard}
          setIsPlayingAgainstAi={setIsPlayingAgainstAi}
        />
        <SelectPlayMode
          handleClickPlayAgainstAI={handleClickPlayAgainstAI}
          handleClickPlayAgainstBot={handleClickPlayAgainstBot}
          handleClickPlayLocally={handleClickPlayLocally}
          setBoard={setBoard}
          size={size}
          generateBoard={generateBoard}
          setIsPlayingAgainstAi={setIsPlayingAgainstAi}
          isPlayingAgainstAi={isPlayingAgainstAi}
        />
        <RestartButton />
      </div>
      <Grid7x7Info />
      <GameInfo />
      <GameOver />
      <PlayAgainButton />
      <div className="flex items-center overflow-auto relative">
        <div
          className={`grid p-8 flex-none`}
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
            aspectRatio: 1 / 1,
          }}
        >
          {board.map((_square, i) => (
            <Square key={i} index={i} />
          ))}
        </div>
      </div>
      <CurrentPlayer />
      <AIErrorMessage />
    </div>
  );
}
