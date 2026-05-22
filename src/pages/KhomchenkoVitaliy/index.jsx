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

    const clickedCell = field[row][col];
    if (clickedCell.state === CELL_STATE.OPENED || clickedCell.state === CELL_STATE.FLAGGED) return;

    if (clickedCell.type === CELL_CONTENT.MINE) {
      const loseField = field.map(fieldRow => fieldRow.map(cell => ({ ...cell })));
      loseField.forEach(fieldRow => {
        fieldRow.forEach(cell => {
          if (cell.type === CELL_CONTENT.MINE) {
            cell.state = CELL_STATE.OPENED;
          }
        });
      });
      setField(loseField);
      setStatus(GAME_STATUS.LOSE);
      return;
    }

    let nextField;
    
    if (clickedCell.neighborMines === 0) {
      nextField = revealEmptyNeighbors(field, row, col);
    } else {
      nextField = field.map(fieldRow => fieldRow.map(cell => ({ ...cell })));
      nextField[row][col].state = CELL_STATE.OPENED;
    }

    setField(nextField);

    if (checkWin(nextField, MINES_COUNT)) {
      setStatus(GAME_STATUS.WIN);
    }
  };

  const handleRightClick = (row, col) => {
    if (status !== GAME_STATUS.PROCESS) return;

    const newField = field.map(fieldRow => fieldRow.map(cell => ({ ...cell })));
    const clickedCell = newField[row][col];

    if (clickedCell.state === CELL_STATE.OPENED) return;

    if (clickedCell.state === CELL_STATE.CLOSED) {
      clickedCell.state = CELL_STATE.FLAGGED;
      setFlagsCount(prev => prev + 1);
    } else if (clickedCell.state === CELL_STATE.FLAGGED) {
      clickedCell.state = CELL_STATE.CLOSED;
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