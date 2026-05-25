import React, { useState, useEffect, useRef } from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 16;

const MinesweeperReact = () => {
  const [field, setField] = useState([]);
  const [status, setStatus] = useState('process');
  const [gameTime, setGameTime] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const timerRef = useRef(null);

  const initGame = () => {
    setStatus('process');
    setGameMessage('');
    setGameTime(0);

    let newField = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        row.push({ type: 'empty', state: 'closed', neighbourMines: 0, row: r, col: c });
      }
      newField.push(row);
    }

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
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              if (newField[nr][nc].type === 'mine') count++;
            }
          }
        }
        newField[r][c].neighbourMines = count;
      }
    }
    setField(newField);
  };

  useEffect(() => {
    if (status === 'process') {
      timerRef.current = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const flagCount = field.flat().filter(c => c.state === 'flagged').length;
  const flagsRemained = MINES_COUNT - flagCount;

  const handleOpenCell = (row, col) => {
    if (status !== 'process' || field[row][col].state !== 'closed') return;

    const newField = JSON.parse(JSON.stringify(field));
    const cell = newField[row][col];

    if (cell.type === 'mine') {
      cell.state = 'opened';
      setField(newField);
      setStatus('lose');
      setGameMessage('Ви підірвалися! Гра закінчена.');
      return;
    }

    const openRecursive = (r, c, fieldGrid) => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
      const currentCell = fieldGrid[r][c];
      if (currentCell.state !== 'closed' || currentCell.type === 'mine') return;

      currentCell.state = 'opened';

      if (currentCell.neighbourMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            openRecursive(r + dr, c + dc, fieldGrid);
          }
        }
      }
    };

    openRecursive(row, col, newField);

    let closedEmptyCells = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newField[r][c].type === 'empty' && newField[r][c].state !== 'opened') {
          closedEmptyCells++;
        }
      }
    }

    if (closedEmptyCells === 0) {
      setStatus('win');
      setGameMessage('Вітаємо, ви виграли!');
    }

    setField(newField);
  };

  const handleContextMenu = (e, row, col) => {
    e.preventDefault();
    if (status !== 'process' || field[row][col].state === 'opened') return;

    const newField = [...field];
    const cell = { ...newField[row][col] };
    cell.state = cell.state === 'flagged' ? 'closed' : 'flagged';
    newField[row] = [...newField[row]];
    newField[row][col] = cell;

    setField(newField);
  };

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.maindiv}>
        <div className={styles.head}>
          <h1 className={styles.headText}>Minesweeper (React)</h1>
        </div>
        <div className={styles.info}>
          <div className={styles.timeCount}>
            <div className={styles.timeNumLeft}>
              {String(Math.max(0, flagsRemained)).padStart(3, '0')}
            </div>
            <div className={styles.emoji}>
              <img src="https://media.tenor.com/JC_6pC5dhw8AAAAe/minesweeperplus-minesweeper.png" alt="Emoji" />
            </div>
            <div className={styles.timeNumRight}>
              {String(gameTime).padStart(3, '0')}
            </div>
          </div>
          <p className={styles.gameMessage}>{gameMessage}</p>
          <div className={styles.timeCount}>
            <span className={styles.flagCount}>Кількість прапорців: {flagsRemained}</span>
            <button className={styles.button} onClick={initGame}>Start</button>
          </div>
        </div>

        <div className={styles.gameBoard}>
          {field.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.cellRow}>
              {row.map((cell, colIndex) => (
                <Cell
                  key={colIndex}
                  cellData={cell}
                  onClick={() => handleOpenCell(rowIndex, colIndex)}
                  onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinesweeperReact;