import React, { useState, useEffect } from 'react';
import styles from './Minesweeper.module.css'; 
import { 
  createBoard, 
  generateMinesAndNumbers, 
  revealCells, 
  CellTypeVH, 
  CellStatusVH, 
  GameStatusVH 
} from './gameLogic';

const vRows = 10;
const vCols = 10;
const vMines = 15;

const Minesweeper = () => {
  const [vBoard, setVBoard] = useState([]);
  const [vStatus, setVStatus] = useState(GameStatusVH.PLAYING);
  const [vTime, setVTime] = useState(0);
  const [vFlags, setVFlags] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const initGame = () => {
    setVBoard(createBoard(vRows, vCols));
    setVStatus(GameStatusVH.PLAYING);
    setVTime(0);
    setVFlags(0);
    setIsFirstClick(true);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (vStatus !== GameStatusVH.PLAYING) return;
    const timer = setInterval(() => {
      setVTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [vStatus]);

  // Виправлена win-state board mutation помилка
  const checkWinCondition = (currentBoard) => {
    let closedSafeCells = 0;
    currentBoard.forEach(row => row.forEach(cell => {
      if (cell.type !== CellTypeVH.MINE && cell.state !== CellStatusVH.OPENED) {
        closedSafeCells++;
      }
    }));

    if (closedSafeCells === 0) {
      setVStatus(GameStatusVH.WIN);
      setVBoard(
        currentBoard.map(row =>
          row.map(cell => ({ ...cell, state: CellStatusVH.OPENED }))
        )
      );
    }
  };

  const handleCellClick = (r, c) => {
    if (vStatus !== GameStatusVH.PLAYING || vBoard[r][c].state !== CellStatusVH.CLOSED) return;

    let updatedBoard = vBoard;

    if (isFirstClick) {
      updatedBoard = generateMinesAndNumbers(vBoard, vRows, vCols, vMines, r, c);
      setIsFirstClick(false);
    }

    if (updatedBoard[r][c].type === CellTypeVH.MINE) {
      setVStatus(GameStatusVH.LOSE);
      setVBoard(
        updatedBoard.map(row =>
          row.map(cell => cell.type === CellTypeVH.MINE ? { ...cell, state: CellStatusVH.OPENED } : cell)
        )
      );
      return;
    }

    const boardAfterReveal = revealCells(updatedBoard, r, c, vRows, vCols);
    setVBoard(boardAfterReveal);
    checkWinCondition(boardAfterReveal);
  };

  const handleCellContextMenu = (e, r, c) => {
    e.preventDefault();
    if (vStatus !== GameStatusVH.PLAYING || vBoard[r][c].state === CellStatusVH.OPENED) return;

    const updatedBoard = vBoard.map(row => row.map(cell => {
      if (cell.row === r && cell.col === c) {
        let nextState = CellStatusVH.CLOSED;
        if (cell.state === CellStatusVH.CLOSED && vFlags < vMines) {
          nextState = CellStatusVH.FLAGGED;
          setVFlags(prev => prev + 1);
        } else if (cell.state === CellStatusVH.FLAGGED) {
          setVFlags(prev => prev - 1);
        }
        return { ...cell, state: nextState };
      }
      return cell;
    }));

    setVBoard(updatedBoard);
  };

  return (
    <div className={styles.gameContainer}>
      <header className={styles.header}>
        <div className={styles.statusItem}>{String(vTime).padStart(3, '0')}</div>
        <button type="button" className={styles.resetBtn} onClick={initGame} aria-label="Restart game">
          {vStatus === GameStatusVH.LOSE ? '😭' : vStatus === GameStatusVH.WIN ? '😎' : '😊'}
        </button>
        <div className={styles.statusItem}>{String(vMines - vFlags).padStart(3, '0')}</div>
      </header>

      {/* Grid semantics: замінили <main> на <div> з роллю сітки */}
      <div 
        role="grid" 
        aria-label="Minesweeper board" 
        className={styles.board}
        style={{ gridTemplateColumns: `repeat(${vCols}, 30px)` }}
      >
        {vBoard.map((row, rowIndex) => (
          <div role="row" key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => {
              let cellText = '';
              let cellClass = styles.cell;

              if (cell.state === CellStatusVH.OPENED) {
                cellClass = `${styles.cell} ${styles.cellopen}`;
                if (cell.type === CellTypeVH.MINE) {
                  cellText = '💣';
                  if (vStatus === GameStatusVH.LOSE) cellClass += ` ${styles.mineExploded}`;
                } else if (cell.neighborMines > 0) {
                  cellText = cell.neighborMines;
                  cellClass += ` ${styles[`color${cell.neighborMines}`]}`;
                }
              } else if (cell.state === CellStatusVH.FLAGGED) {
                cellText = '🚩';
              }

              return (
                <button
                  key={colIndex}
                  type="button"
                  role="gridcell"
                  className={cellClass}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleCellContextMenu(e, rowIndex, colIndex)}
                  aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}. ${
                    cell.state === CellStatusVH.OPENED 
                      ? cell.type === CellTypeVH.MINE ? 'Mine' : `${cell.neighborMines} neighbors` 
                      : cell.state === CellStatusVH.FLAGGED ? 'Flagged' : 'Closed'
                  }`}
                >
                  {cellText}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Minesweeper;