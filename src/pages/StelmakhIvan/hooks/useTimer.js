import { useEffect } from "react";

export function useTimer(gameStatus, onTick) {
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timerInterval = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStatus, onTick]);
}
