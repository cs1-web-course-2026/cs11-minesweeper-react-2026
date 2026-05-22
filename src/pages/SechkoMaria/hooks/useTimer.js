import { useState, useEffect } from 'react';
import { GAME_STATUS } from '../constants/game';

export function useTimer(status, isFirstClick) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timerId;
    if (status === GAME_STATUS.PLAYING && !isFirstClick) {
      timerId = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [status, isFirstClick]);

  const resetTimer = () => setTime(0);

  return { time, resetTimer };
}