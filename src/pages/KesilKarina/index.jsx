import { useState, useEffect } from 'react';
import {
  generateField,
  countNeighborMines,
  openCell,
  revealAllMines,
  checkWin,
  toggleFlag,
  GAME_STATUS,
  CELL_TYPE,
  CELL_STATE
} from './gameLogic';
import Board from './components/Board/Board';
import Timer from './components/Timer/Timer';
import RestartButton from './components/RestartButton/RestartButton';
import styles from './index.module.css';

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 15;

function createNewBoard() {
  const field = generateField(ROWS, COLS, MINES_COUNT);
  return countNeighborMines(field, ROWS, COLS);
}

export default function KesilKarina() {
  const [board, setBoard] = useState(() => createNewBoard());
  const [status, setStatus] = useState(GAME_STATUS.PROCESS);
  const [gameTime, setGameTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => setGameTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  const flaggedCount = board.flat().filter(c => c.state === CELL_STATE.FLAGGED).length;
  const minesLeft = MINES_COUNT - flaggedCount;

  function handleRestart() {
    setBoard(createNewBoard());
    setStatus(GAME_STATUS.PROCESS);
    setGameTime(0);
    setTimerActive(false);
  }

  function handleCellClick(row, col) {
    if (status !== GAME_STATUS.PROCESS) return;

    const cell = board[row][col];
    if (cell.state !== CELL_STATE.CLOSED) return;

    setTimerActive(true);

    if (cell.type === CELL_TYPE.MINE) {
      const newBoard = revealAllMines(board);
      setBoard(newBoard);
      setStatus(GAME_STATUS.LOSE);
      setTimerActive(false);
      return;
    }

    const newBoard = openCell(board, row, col, ROWS, COLS);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setStatus(GAME_STATUS.WIN);
      setTimerActive(false);
    }
  }

  function handleCellRightClick(row, col) {
    if (status !== GAME_STATUS.PROCESS) return;

    const cell = board[row][col];
    if (cell.state === CELL_STATE.OPENED) return;

    setBoard(toggleFlag(board, row, col));
  }

  function getStatusText() {
    if (status === GAME_STATUS.WIN) return '🎉 Cleared!';
    if (status === GAME_STATUS.LOSE) return '💥 Game Over';
    return `💣 ${minesLeft}`;
  }

  return (
    <div className={styles.game}>
      <div className={styles.header}>
        <Timer time={gameTime} />
        <div className={styles.minesCounter}>{getStatusText()}</div>
      </div>
      <Board
        board={board}
        onCellClick={handleCellClick}
        onCellRightClick={handleCellRightClick}
      />
      <RestartButton onRestart={handleRestart} />
    </div>
  );
}
