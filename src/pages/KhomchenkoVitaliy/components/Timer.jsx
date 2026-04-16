import React, { useEffect, useState } from 'react';
import { GAME_STATUS } from '../constants';
import styles from './Timer.module.css';

const Timer = ({ status }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timerId;
    if (status === GAME_STATUS.PROCESS) {
      timerId = setInterval(() => setTime((t) => t + 1), 1000);
    } else if (status === GAME_STATUS.WIN || status === GAME_STATUS.LOSE) {
      clearInterval(timerId);
    }
    
    if (status === GAME_STATUS.PROCESS && time !== 0) {
        setTime(0);
    }

    return () => clearInterval(timerId);
  }, [status]);

  return <div className={styles.timer}>{String(time).padStart(3, '0')}</div>;
};

export default Timer;