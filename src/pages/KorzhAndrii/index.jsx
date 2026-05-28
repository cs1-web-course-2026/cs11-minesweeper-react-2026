
import { useState, useCallback } from 'react';

import Board from './components/Board';
import Timer from './components/Timer';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';

import {
  generateField,
  openCellInField,
  toggleFlagInField,
  countFlags,
  ROWS,
  COLS,
  MINES_COUNT,
} from './gameLogic';

import styles from './index.module.css';

function MinesweeperGame() {

  const [field, setField] = useState(() => generateField(ROWS, COLS, MINES_COUNT));
  const [status, setStatus] = useState('process'); 
  const [time, setTime] = useState(0);


  function handleTick() {
    setTime(prev => prev + 1);
  }

 
  function handleRestart() {
    setField(generateField(ROWS, COLS, MINES_COUNT));
    setStatus('process');
    setTime(0);
  }


  const handleLeftClick = useCallback(
    (row, col) => {
      if (status !== 'process') return;
      const { newField, status: newStatus } = openCellInField(field, row, col, ROWS, COLS);
      setField(newField);
      setStatus(newStatus);
    },
    [field, status]
  );


  const handleRightClick = useCallback(
    (row, col) => {
      if (status !== 'process') return;
      const newField = toggleFlagInField(field, row, col);
      setField(newField);
    },
    [field, status]
  );

  const flagsPlaced = countFlags(field);
  const flagsLeft = MINES_COUNT - flagsPlaced;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>💣 Minesweeper</h1>

      {/* Хедер: таймер, лічильник прапорців, кнопка */}
      <header className={styles.header}>
        <div className={styles.infoBlock}>
          <span>💣</span>
          <span className={styles.infoValue}>{flagsLeft}</span>
        </div>

        <RestartButton onClick={handleRestart} />

        <Timer
          isRunning={status === 'process'}
          time={time}
          onTick={handleTick}
        />
      </header>

      {/* Ігрове поле */}
      <main>
        <Board
          field={field}
          cols={COLS}
          onLeftClick={handleLeftClick}
          onRightClick={handleRightClick}
          gameOver={status !== 'process'}
        />
      </main>

      {/* Статус гри */}
      <GameStatus status={status} time={time} />
    </div>
  );
}

export default MinesweeperGame;
