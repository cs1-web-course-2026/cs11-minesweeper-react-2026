import { useState, useEffect, useCallback, useRef } from "react";
import Cell from "./components/Cell";
import DigitalDisplay from "./components/DigitalDisplay";
import { CELL_STATE, CELL_TYPE, GAME_STATUS, ROWS, COLS, MINES } from "./constants.js";
import styles from "./Minesweeper.module.css";

function buildField(rows, cols, minesCount) {
  const field = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      type: CELL_TYPE.EMPTY, state: CELL_STATE.CLOSED, neighbourMines: 0, row: r, col: c,
    }))
  );
  let placed = 0;
  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (field[r][c].type !== CELL_TYPE.MINE) { field[r][c].type = CELL_TYPE.MINE; placed++; }
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (field[r][c].type === CELL_TYPE.MINE) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && field[nr][nc].type === CELL_TYPE.MINE) count++;
        }
      field[r][c].neighbourMines = count;
    }
  return field;
}

function cloneField(field) { return field.map(row => row.map(cell => ({ ...cell }))); }

function openCellMutate(field, r, c, rows, cols) {
  const cell = field[r][c];
  if (cell.state !== CELL_STATE.CLOSED) return;
  cell.state = CELL_STATE.OPENED;
  if (cell.type !== CELL_TYPE.MINE && cell.neighbourMines === 0)
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) openCellMutate(field, nr, nc, rows, cols);
      }
}

function checkWon(field, rows, cols) {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (field[r][c].type === CELL_TYPE.EMPTY && field[r][c].state !== CELL_STATE.OPENED) return false;
  return true;
}

export default function Minesweeper() {
  const [field,   setField]   = useState(() => buildField(ROWS, COLS, MINES));
  const [status,  setStatus]  = useState(GAME_STATUS.PLAYING);
  const [time,    setTime]    = useState(0);
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (status === GAME_STATUS.PLAYING) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const flagsPlaced = field.flat().filter(c => c.state === CELL_STATE.FLAGGED).length;
  const flagsLeft   = MINES - flagsPlaced;

  const initGame = useCallback(() => {
    clearInterval(timerRef.current);
    setField(buildField(ROWS, COLS, MINES));
    setStatus(GAME_STATUS.PLAYING);
    setTime(0);
    setMessage("");
  }, []);

  const handleOpen = useCallback((r, c) => {
    if (status !== GAME_STATUS.PLAYING) return;
    const next = cloneField(field);
    const cell = next[r][c];
    if (cell.state !== CELL_STATE.CLOSED) return;
    if (cell.type === CELL_TYPE.MINE) {
      cell.state = CELL_STATE.OPENED;
      next.forEach(row => row.forEach(cl => { if (cl.type === CELL_TYPE.MINE) cl.state = CELL_STATE.OPENED; }));
      setField(next);
      setStatus(GAME_STATUS.LOST);
      setMessage("💣 You hit a mine! Game over.");
      setTimeout(() => { setMessage(""); initGame(); }, 2000);
      return;
    }
    openCellMutate(next, r, c, ROWS, COLS);
    setField(next);
    if (checkWon(next, ROWS, COLS)) {
      setStatus(GAME_STATUS.WON);
      setMessage("🎉 Congratulations, you won!");
      setTimeout(() => { setMessage(""); initGame(); }, 2500);
    }
  }, [field, status, initGame]);

  const handleFlag = useCallback((r, c) => {
    if (status !== GAME_STATUS.PLAYING) return;
    const next = cloneField(field);
    const cell = next[r][c];
    if (cell.state === CELL_STATE.OPENED) return;
    cell.state = cell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED;
    setField(next);
  }, [field, status]);

  const messageClass = `${styles.message} ${
    status === GAME_STATUS.LOST ? styles.msgLost : styles.msgWon
  } ${message ? styles.msgPulse : ""}`;

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>MINESWEEPER</h1>
      </div>

      <div className={styles.infoBar}>
        <DigitalDisplay value={flagsLeft} />
        <button onClick={initGame} title="Restart game" className={styles.resetBtn}>
          {status === GAME_STATUS.LOST ? "💀" : status === GAME_STATUS.WON ? "😎" : "👾"}
        </button>
        <DigitalDisplay value={time} />
      </div>

      <div className={styles.flagRow}>
        <span className={styles.flagText}>
          🚩 Flags: <span className={styles.flagCount}>{flagsLeft}</span> / {MINES}
        </span>
        <button onClick={initGame} className={styles.startBtn}>
          START
        </button>
      </div>

      <div className={messageClass} role="status" aria-live="polite">
        {message}
      </div>

      <div className={styles.grid}>
        {field.map((row, r) => (
          <div key={r} className={styles.row}>
            {row.map((cell, c) => (
              <Cell
                key={c}
                cell={cell}
                rowIndex={r}
                colIndex={c}
                onOpen={handleOpen}
                onFlag={handleFlag}
                gameOver={status !== GAME_STATUS.PLAYING}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}