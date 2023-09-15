import { useState } from "react";

export type Mark = "X" | "O";
export type Turn = "player" | "opponent";
export type Player = {
  player: Mark;
  opponent: Mark;
  turn: Turn;
  multiplayerTurn: string;
  playerOnWinStreak: Mark;
  winStreak: number;
  opponentWinStreak: number;
  player1Name: string;
  player2Name: string;
  playerOnWinStreakMultiplayerId: string;
};

export const usePlayer = () => {
  const [player, setPlayer] = useState<Player>({
    player: "X",
    opponent: "O",
    turn: "player",
    multiplayerTurn: "",
    playerOnWinStreak: "O",
    winStreak: 0,
    opponentWinStreak: 0,
    player1Name: "X",
    player2Name: "O",
    playerOnWinStreakMultiplayerId: "",
  });

  const togglePlayer = () => {
    let newPlayer = player;
    setPlayer((prev) => {
      newPlayer = {
        ...prev,
        player: prev.player === "X" ? "O" : "X",
        opponent: prev.opponent === "X" ? "O" : "X",
      };
      return newPlayer;
    });
    return newPlayer;
  };

  const toggleTurn = () => {
    let newPlayer = player;
    setPlayer((prev) => {
      newPlayer = {
        ...prev,
        turn: prev.turn === "player" ? "opponent" : "player",
      };
      return newPlayer;
    });
    return newPlayer;
  };

  const handleWinStreak = (winner?: Mark, draw?: boolean): Player => {
    let newPlayer = { ...player };
    const prevWinner = winner === "X" ? "O" : "X";
    const winStreak = prevWinner === newPlayer.playerOnWinStreak;
    const opponentWinStreak = prevWinner !== newPlayer.playerOnWinStreak;

    if (winner) {
      if (winStreak) {
        newPlayer.playerOnWinStreak = winner;
        newPlayer.winStreak += 1;
        newPlayer.opponentWinStreak = 0;
      }
      if (opponentWinStreak) {
        newPlayer.playerOnWinStreak = winner;
        newPlayer.opponentWinStreak += 1;
        newPlayer.winStreak = 0;
      }
    }
    if (draw) {
      newPlayer.opponentWinStreak = 0;
      newPlayer.winStreak = 0;
    }

    setPlayer(newPlayer);

    return newPlayer;
  };

  return {
    player,
    setPlayer,
    togglePlayer,
    toggleTurn,
    handleWinStreak,
  };
};
