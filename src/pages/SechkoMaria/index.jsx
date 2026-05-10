import React, { useState, useEffect, useCallback } from 'react';
import { Cell } from './Cell';
import styles from './styles.module.css';

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 15;

const GAME_STATUS = { PLAYING: 'playing', WON: 'won', LOST: 'lost' };

const formatNumber = (num) => num.toString().padStart(3, '0');

export const Minesweeper = () => {
  const [field, setField] = useState([]);
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [time, setTime] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const initGame = useCallback(() => {
    let newField = Array(ROWS).fill().map(() =>
      Array(COLS).fill().map(() => ({
        type: 'empty',
        state: 'closed',
        neighborMines: 0,
      }))
    );

    let placedMines = 0;
    while (placedMines < MINES_COUNT) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (newField[r][c].type !== 'mine') {
        newField[r][c].type = 'mine';
        placedMines++;
      }
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newField[r][c].type === 'mine') continue;
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const nr = r + i, nc = c + j;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newField[nr][nc].type === 'mine') {
              count++;
            }
          }
        }
        newField[r][c].neighborMines = count;
      }
    }

    setField(newField);
    setStatus(GAME_STATUS.PLAYING);
    setFlagsUsed(0);
    setTime(0);
    setIsFirstClick(true);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let timerId;
    if (status === GAME_STATUS.PLAYING && !isFirstClick) {
      timerId = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [status, isFirstClick]);

  const openCell = (row, col) => {
    if (status !== GAME_STATUS.PLAYING || field[row][col].state !== 'closed') return;
    if (isFirstClick) setIsFirstClick(false);

    const newField = [...field.map(r => [...r])];

    const floodFill = (r, c) => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || newField[r][c].state !== 'closed') return;
      newField[r][c].state = 'opened';
      if (newField[r][c].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) floodFill(r + i, c + j);
        }
      }
    };

    if (newField[row][col].type === 'mine') {
      newField[row][col].state = 'opened';
      setStatus(GAME_STATUS.LOST);
      newField.forEach(r => r.forEach(c => {
        if (c.type === 'mine') c.state = 'opened';
      }));
    } else {
      floodFill(row, col);
      let closedEmpty = 0;
      newField.forEach(r => r.forEach(c => {
        if (c.type === 'empty' && c.state !== 'opened') closedEmpty++;
      }));
      if (closedEmpty === 0) setStatus(GAME_STATUS.WON);
    }
    setField(newField);
  };

  const toggleFlag = (row, col) => {
    if (status !== GAME_STATUS.PLAYING || field[row][col].state === 'opened') return;
    
    const newField = [...field.map(r => [...r])];
    const cell = newField[row][col];

    if (cell.state === 'closed') {
      cell.state = 'flagged';
      setFlagsUsed(prev => prev + 1);
    } else if (cell.state === 'flagged') {
      cell.state = 'closed';
      setFlagsUsed(prev => prev - 1);
    }
    setField(newField);
  };

  let smile = '🙂';
  if (status === GAME_STATUS.LOST) smile = '😵';
  if (status === GAME_STATUS.WON) smile = '😎';

  return (
    <div className={styles.gameContainer}>
      <header className={styles.header}>
        <div className={styles.counter}>{formatNumber(MINES_COUNT - flagsUsed)}</div>
        <button className={styles.smileBtn} onClick={initGame} aria-label="Restart">
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