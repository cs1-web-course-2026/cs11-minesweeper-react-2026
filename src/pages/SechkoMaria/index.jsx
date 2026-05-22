import React, { useEffect } from 'react';
import { Cell } from './Cell';
import styles from './styles.module.css';
import { GAME_STATUS } from './constants/game';
import { useGameState, MINES_COUNT } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';

const formatNumber = (num) => num.toString().padStart(3, '0');

export const Minesweeper = () => {
  const { field, status, flagsUsed, isFirstClick, initGame, openCell, toggleFlag } = useGameState();
  const { time, resetTimer } = useTimer(status, isFirstClick);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleReset = () => {
    initGame();
    resetTimer();
  };

  let smile = '🙂';
  if (status === GAME_STATUS.LOST) smile = '😵';
  if (status === GAME_STATUS.WON) smile = '😎';

  return (
    <div className={styles.gameContainer}>
      <header className={styles.header}>
        <div className={styles.counter}>{formatNumber(MINES_COUNT - flagsUsed)}</div>
        <button className={styles.smileBtn} onClick={handleReset} aria-label="Restart">
          {smile}
        </button>
        <div className={styles.counter}>{formatNumber(time)}</div>
      </header>

      <main className={styles.grid}>
        {field.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              cellData={cell}
              onOpen={openCell}
              onFlag={toggleFlag}
            />
          ))
        )}
      </main>
      
      {status === GAME_STATUS.LOST && <p>Game Over! Ви підірвалися.</p>}
      {status === GAME_STATUS.WON && <p>Вітаємо! Ви перемогли!</p>}
    </div>
  );
};

export default Minesweeper;