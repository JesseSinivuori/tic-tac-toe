import { GameMode } from "../providers/GameLogicProvider";
import { fire } from "./confetti";
import { Player } from "./gameLogic/usePlayer";

export const launchFireWorks = (player: Player, gameMode: GameMode) => {
  const fireWorks = () => {
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    const winStreak = player.winStreak || player.opponentWinStreak;
    const multiplayerWinStreak = gameMode === "MULTIPLAYER" && winStreak > 2;
    if (
      player.winStreak > 2 ||
      (gameMode === "LOCAL" && winStreak > 2) ||
      multiplayerWinStreak
    ) {
      for (let i = 0; i < winStreak && i <= 10; i++) {
        setTimeout(() => {
          fire(0.35 + i * 0.1, {
            spread: 100 + i * 15,
            decay: 0.91,
            scalar: 0.8,
          });
        }, 500 * i);
      }
    }
  };
  return fireWorks();
};
