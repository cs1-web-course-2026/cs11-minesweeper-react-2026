import React from 'react';
import { GAME_STATUS } from '../constants';
import styles from './GameStatus.module.css';

const GameStatus = ({ status }) => {
  if (status === GAME_STATUS.PROCESS) return null;

  const isWin = status === GAME_STATUS.WIN;
  return (
    <p 
      className={`${styles.message} ${isWin ? styles.messageWin : styles.messageLoss}`} 
      role="status" 
      aria-live="polite"
    >
      {isWin ? '🎉 You won!' : '💥 Game over! You hit a mine.'}
    </p>
  );
};

export default GameStatus;