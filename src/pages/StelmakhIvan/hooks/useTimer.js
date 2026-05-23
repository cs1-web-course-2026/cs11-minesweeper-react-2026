import { useEffect } from "react";
import { GAME_STATUS } from "./constants";

export function useTimer(gameStatus, onTick) {
  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) return;

    const timerInterval = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStatus, onTick]);
}
