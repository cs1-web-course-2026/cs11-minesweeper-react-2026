import React, { useState, useEffect, useCallback } from 'react';
import { GAME_STATUS, CELL_STATE, CELL_CONTENT } from './constants';
import { generateField, revealEmptyNeighbors, checkWin } from './logic';

import Board from './components/Board';
import Timer from './components/Timer';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';

import styles from './Minesweeper.module.css';

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 15;

const Minesweeper = () => {
  const [field, setField] = useState([]);
  const [status, setStatus] = useState(GAME_STATUS.PROCESS);
  const [flagsCount, setFlagsCount] = useState(0);
  const [gameId, setGameId] = useState(0);

  const initGame = useCallback(() => {
    setField(generateField(ROWS, COLS, MINES_COUNT));
    setStatus(GAME_STATUS.PROCESS);
    setFlagsCount(0);
    setGameId(prev => prev + 1);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = (row, col) => {
    if (status !== GAME_STATUS.PROCESS) return;

    const cell = field[row][col];
    if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) return;

    const newField = field.map(fieldRow => fieldRow.map(cell => ({ ...cell })));
    const currentCell = newField[row][col];

    currentCell.state = CELL_STATE.OPENED;

    if (currentCell.type === CELL_CONTENT.MINE) {
      
      newField.forEach(r => {
        r.forEach(c => {
          if (c.type === CELL_CONTENT.MINE) {
            c.state = CELL_STATE.OPENED;
          }
        });
      });

      setField(newField);
      setStatus(GAME_STATUS.LOSE);
      return;
    }

    if (currentCell.neighborMines === 0) {
      revealEmptyNeighbors(newField, row, col);
    }

    setField(newField);

    if (checkWin(newField, MINES_COUNT)) {
      setStatus(GAME_STATUS.WIN);
    }
  };

  const handleRightClick = (row, col) => {
    if (status !== GAME_STATUS.PROCESS) return;

    const newField = field.map(r => r.map(c => ({ ...c })));
    const cell = newField[row][col];

    if (cell.state === CELL_STATE.OPENED) return;

    if (cell.state === CELL_STATE.CLOSED) {
      cell.state = CELL_STATE.FLAGGED;
      setFlagsCount(prev => prev + 1);
    } else if (cell.state === CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.CLOSED;
      setFlagsCount(prev => prev - 1);
    }

    setField(newField);
  };

  const remainingFlags = Math.max(0, MINES_COUNT - flagsCount);

  if (field.length === 0) return null;

  return (
    <div className={styles.gameWrapper}>
      <main className={styles.gameContainer}>
        <GameStatus status={status} />
        <header className={styles.gameHeader}>
          <Timer status={status} gameId={gameId} />
          <RestartButton onRestart={initGame} />
          <div className={styles.flags}>{String(remainingFlags).padStart(3, '0')}</div>
        </header>
        <Board 
          field={field} 
          onCellClick={handleCellClick} 
          onCellRightClick={handleRightClick} 
        />
      </main>
    </div>
  );
};

export default Minesweeper;