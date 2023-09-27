import { GameMode } from "../providers/GameLogicProvider";

export const setGameModeToLocalStorage = ({
  gameMode,
}: {
  gameMode: GameMode;
}) => {
  if (window === undefined) {
    throw new Error("setGameModeToLocalStorage can only be used on Client.");
  }
  localStorage.setItem("gameMode", gameMode);
};

export const getGameModeFromLocalStorage = () => {
  if (window === undefined) {
    throw new Error("getGameModeFromLocalStorage can only be used on Client.");
  }
  const gameModeInStorage = localStorage.getItem("gameMode");
  if (gameModeInStorage) {
    return gameModeInStorage;
  }
};

export const setPlayerToLocalStorage = (player: {
  id: string;
  name: string;
}) => {
  if (window === undefined) {
    throw new Error("setPlayerToLocalStorage can only be used on Client.");
  }
  window.localStorage.setItem("player", JSON.stringify(player));
};

export const getPlayerFromLocalStorage = () => {
  if (window === undefined) {
    throw new Error("getPlayerFromLocalStorage can only be used on Client.");
  }
  const playerInStorage = window.localStorage.getItem("player");
  if (playerInStorage) {
    const parsedPlayer = JSON.parse(playerInStorage);
    return parsedPlayer;
  }
};
