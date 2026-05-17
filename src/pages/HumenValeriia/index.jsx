import React, { useState, useEffect } from 'react';
import styles from './Minesweeper.module.css';

const CellStatusVH = { CLOSED: 'closed', OPENED: 'opened', FLAGGED: 'flagged' };
const CellTypeVH = { EMPTY: 'empty', MINE: 'mine' };
const GameStatusVH = { PLAYING: 'process', WIN: 'win', LOSE: 'lose' };

const vRows = 10;
const vCols = 10;
const vMines = 15;

const Cell = ({ cellData, onClick, onContextMenu, gameStatus }) => {
  let cellText = '';
  let cellClass = styles.cell;

  if (cellData.state === CellStatusVH.OPENED) {
    cellClass = `${styles.cell} ${styles.cellOpen}`;
    if (cellData.type === CellTypeVH.MINE) {
      cellText = '💣';
      // якщо програли, підсвічуємо міни червоним
      if (gameStatus === GameStatusVH.LOSE) cellClass += ` ${styles.mineExploded}`;
    } else if (cellData.neighborMines > 0) {
      cellText = cellData.neighborMines;
      cellClass += ` ${styles[`color${cellData.neighborMines}`]}`;
    }
  } else if (cellData.state === CellStatusVH.FLAGGED) {
    cellText = '🚩';
  }

  return (
    <button
      type="button"
      className={cellClass}
      onClick={() => onClick(cellData.row, cellData.col)}
      onContextMenu={(e) => onContextMenu(e, cellData.row, cellData.col)}
      aria-label={`Row ${cellData.row + 1}, column ${cellData.col + 1}, ${cellData.state}`}
    >
      {cellText}
    </button>
  );
};

const Minesweeper = () => {
  // замість let field = [] тепер використовую useState
  const [vBoard, setVBoard] = useState([]);
  const [vStatus, setVStatus] = useState(GameStatusVH.PLAYING);
  const [vTime, setVTime] = useState(0);
  const [vFlags, setVFlags] = useState(0);

  // Генерація поля
  const initGame = () => {
    let tempBoard = [];
    for (let r = 0; r < vRows; r++) {
      let rowArr = [];
      for (let c = 0; c < vCols; c++) {
        rowArr.push({ row: r, col: c, type: CellTypeVH.EMPTY, neighborMines: 0, state: CellStatusVH.CLOSED });
      }
      tempBoard.push(rowArr);
    }

    // розставляємо міни (рандомно)
    let placedMines = 0;
    while (placedMines < vMines) {
      let r = Math.floor(Math.random() * vRows);
      let c = Math.floor(Math.random() * vCols);
      if (tempBoard[r][c].type !== CellTypeVH.MINE) {
        tempBoard[r][c].type = CellTypeVH.MINE;
        placedMines++;
      }
    }

    // рахуємо міни навколо
    for (let r = 0; r < vRows; r++) {
      for (let c = 0; c < vCols; c++) {
        if (tempBoard[r][c].type === CellTypeVH.MINE) continue;
        let bombsAround = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            let checkY = r + dr, checkX = c + dc;
            // перевірка чи не вийшли за межі масиву
            if (checkY >= 0 && checkY < vRows && checkX >= 0 && checkX < vCols && tempBoard[checkY][checkX].type === CellTypeVH.MINE) {
                bombsAround++;
            }
          }
        }
        tempBoard[r][c].neighborMines = bombsAround;
      }
    }

    setVBoard(tempBoard);
    setVStatus(GameStatusVH.PLAYING);
    setVTime(0);
    setVFlags(0);
  };

  // запускається один раз при старті
  useEffect(() => {
    initGame();
  }, []);

  // хук для таймера, щоб час йшов тільки коли граємо
  useEffect(() => {
    let timerId;
    if (vStatus === GameStatusVH.PLAYING) {
      timerId = setInterval(() => setVTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [vStatus]);

  // клік лівою кнопкою (відкрити клітинку)
  const handleCellClick = (r, c) => {
    if (vStatus !== GameStatusVH.PLAYING) return;
    
    // роблю копію масиву (в реакті не можна напряму міняти стейт)
    const updatedBoard = vBoard.map(row => row.map(cell => ({ ...cell })));
    const clickedCell = updatedBoard[r][c];

    if (clickedCell.state !== CellStatusVH.CLOSED) return;

    // якщо попали на міну
    if (clickedCell.type === CellTypeVH.MINE) {
      clickedCell.state = CellStatusVH.OPENED;
      updatedBoard.forEach(row => row.forEach(cl => {
        if (cl.type === CellTypeVH.MINE) cl.state = CellStatusVH.OPENED;
      }));
      setVBoard(updatedBoard);
      setVStatus(GameStatusVH.LOSE);
      return;
    }

    // рекурсивне відкриття пустих клітинок
    const revealCells = (row, col) => {
      if (row < 0 || row >= vRows || col < 0 || col >= vCols) return;
      let current = updatedBoard[row][col];
      if (current.state !== CellStatusVH.CLOSED) return;
      
      current.state = CellStatusVH.OPENED;
      if (current.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) revealCells(row + dr, col + dc);
        }
      }
    };

    revealCells(r, c);
    setVBoard(updatedBoard);
    checkWinCondition(updatedBoard);
  };

  // правий клік (поставити прапорець)
  const handleContextMenu = (e, r, c) => {
    e.preventDefault(); // щоб не випадало меню браузера
    if (vStatus !== GameStatusVH.PLAYING) return;

    const updatedBoard = vBoard.map(row => row.map(cell => ({ ...cell })));
    const clickedCell = updatedBoard[r][c];

    if (clickedCell.state === CellStatusVH.OPENED) return;

    clickedCell.state = clickedCell.state === CellStatusVH.FLAGGED ? CellStatusVH.CLOSED : CellStatusVH.FLAGGED;
    
    let flagsCount = 0;
    updatedBoard.forEach(row => row.forEach(cl => {
      if (cl.state === CellStatusVH.FLAGGED) flagsCount++;
    }));
    
    setVFlags(flagsCount);
    setVBoard(updatedBoard);
  };

  // перевірка чи всі безпечні клітинки відкриті
  const checkWinCondition = (currentBoard) => {
    let closedSafeCells = 0;
    currentBoard.forEach(row => row.forEach(cell => {
      if (cell.type !== CellTypeVH.MINE && cell.state !== CellStatusVH.OPENED) {
         closedSafeCells++;
      }
    }));

    if (closedSafeCells === 0) {
      setVStatus(GameStatusVH.WIN);
      currentBoard.forEach(row => row.forEach(cl => cl.state = CellStatusVH.OPENED));
    }
  };

  // текст для скрінрідера
  let gameMessage = '';
  if (vStatus === GameStatusVH.LOSE) gameMessage = 'Ой! Ви підірвалися на міні! 💥';
  if (vStatus === GameStatusVH.WIN) gameMessage = 'Вітаю! Ви перемогли! 🏆';

  return (
    <div className={styles.gameContainer}>
      <header className={styles.header}>
        <div className={styles.statusItem}>{String(vTime).padStart(3, '0')}</div>
        <button type="button" className={styles.resetBtn} onClick={initGame} aria-label="Restart game">
          {vStatus === GameStatusVH.LOSE ? '😵' : vStatus === GameStatusVH.WIN ? '😎' : '😊'}
        </button>
        <div className={styles.statusItem}>{String(vMines - vFlags).padStart(3, '0')}</div>
      </header>

      <main 
        className={styles.board} 
        style={{ gridTemplateColumns: `repeat(${vCols}, 30px)` }}
      >
        {vBoard.map((row, rIdx) => 
          row.map((cell, cIdx) => (
            <Cell 
              key={`${rIdx}-${cIdx}`} 
              cellData={cell} 
              onClick={handleCellClick} 
              onContextMenu={handleContextMenu}
              gameStatus={vStatus}
            />
          ))
        )}
      </main>

      <p role="status" aria-live="polite" className={styles.visuallyHidden}>{gameMessage}</p>
    </div>
  );
};

export default Minesweeper;