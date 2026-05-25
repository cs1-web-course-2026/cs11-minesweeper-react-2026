import { useState, useCallback } from 'react';
import { createBoard, copyBoard, revealCellLogic } from '../utils/board';
import { GAME_STATUS, CELL_STATE } from '../constants/game';

const ROWS = 10;
const COLS = 10;
export const MINES_COUNT = 15;

export function useGameState() {
  const [field, setField] = useState([]);
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const initGame = useCallback(() => {
    const newBoard = createBoard(ROWS, COLS, MINES_COUNT);
    setField(newBoard);
    setStatus(GAME_STATUS.PLAYING);
    setFlagsUsed(0);
    setIsFirstClick(true);
  }, []);

  const openCell = (row, col) => {
    if (status !== GAME_STATUS.PLAYING || field[row][col].state !== CELL_STATE.CLOSED) return;
    if (isFirstClick) setIsFirstClick(false);

    const { newBoard, newStatus } = revealCellLogic(field, row, col, ROWS, COLS);
    setField(newBoard);
    setStatus(newStatus);
  };

  const toggleFlag = (row, col) => {
    if (status !== GAME_STATUS.PLAYING || field[row][col].state === CELL_STATE.OPENED) return;

    const newBoard = copyBoard(field);
    const cell = newBoard[row][col];

    if (cell.state === CELL_STATE.CLOSED) {
      cell.state = CELL_STATE.FLAGGED;
      setFlagsUsed(prev => prev + 1);
    } else if (cell.state === CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.CLOSED;
      setFlagsUsed(prev => prev - 1);
    }
    setField(newBoard);
  };

  return { field, status, flagsUsed, isFirstClick, initGame, openCell, toggleFlag };
}