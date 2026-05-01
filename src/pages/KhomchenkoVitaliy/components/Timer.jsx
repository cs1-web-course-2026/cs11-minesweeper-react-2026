import React, { useEffect, useState } from 'react';
import { GAME_STATUS } from '../constants';
import styles from './Timer.module.css';

const Timer = ({ status, gameId }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (status !== GAME_STATUS.PROCESS) {
      return undefined;
    }
  
    setTime(0);
    const timerId = setInterval(() => setTime((currentTime) => currentTime + 1), 1000);
  
    return () => clearInterval(timerId);
  }, [status, gameId]);

  return <div className={styles.timer}>{String(time).padStart(3, '0')}</div>;
};

export default Timer;