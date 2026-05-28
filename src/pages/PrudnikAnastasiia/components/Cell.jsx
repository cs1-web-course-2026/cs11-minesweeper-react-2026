import React from 'react';
import { CELL_STATE, CELL_TYPE } from '../constants.js';
import styles from './Cell.module.css';

const NUM_COLORS = ["", "#2563eb","#16a34a","#dc2626","#7c3aed","#c2410c","#0891b2","#be185d","#374151"];

export default function Cell({ cell, onOpen, onFlag, rowIndex, colIndex, gameOver }) {
  
  if (cell.state === CELL_STATE.CLOSED) {
    return (
      <button
        onClick={() => onOpen(rowIndex, colIndex)}
        onContextMenu={e => { e.preventDefault(); onFlag(rowIndex, colIndex); }}
        disabled={gameOver}
        className={`${styles.base} ${styles.closed}`}
        aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, closed`}
      />
    );
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    return (
      <button
        onContextMenu={e => { e.preventDefault(); onFlag(rowIndex, colIndex); }}
        disabled={gameOver}
        className={`${styles.base} ${styles.flagged}`}
        aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, flagged`}
      >🚩</button>
    );
  }

  if (cell.type === CELL_TYPE.MINE) {
    return (
      <button
        disabled
        className={`${styles.base} ${styles.mine}`}
        aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, mine`}
      >💣</button>
    );
  }

  return (
    <button
      disabled
      className={`${styles.base} ${styles.opened}`}
      style={{ color: NUM_COLORS[cell.neighbourMines] || "#111" }}
      aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, opened, ${cell.neighbourMines} adjacent mines`}
    >
      {cell.neighbourMines > 0 ? cell.neighbourMines : ""}
    </button>
  );
}