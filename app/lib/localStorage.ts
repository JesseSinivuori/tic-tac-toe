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

export const setPlayerIdToLocalStorage = (playerId: string) => {
  if (window === undefined) {
    throw new Error("setPlayerIdLocalStorage can only be used on Client.");
  }
  window.localStorage.setItem("playerId", playerId);
};

export const getPlayerIdFromLocalStorage = () => {
  if (window === undefined) {
    throw new Error("getPlayerIdFromLocalStorage can only be used on Client.");
  }
  const playerIdInStorage = window.localStorage.getItem("playerId");
  if (playerIdInStorage) {
    return playerIdInStorage;
  }
};
