import React from 'react';
import styles from './styles.module.css';
import { CELL_STATE, CELL_CONTENT } from './constants/game';

export const Cell = ({ cellData, row, col, onOpen, onFlag }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    onFlag(row, col);
  };

  let cellClass = styles.cell;
  let content = '';
  let textClass = '';

  if (cellData.state === CELL_STATE.OPENED) {
    cellClass = `${styles.cell} ${styles.cellOpened}`;
    if (cellData.type === CELL_CONTENT.MINE) {
      cellClass = `${cellClass} ${styles.mine}`;
      content = '💣';
    } else if (cellData.neighborMines > 0) {
      content = cellData.neighborMines;
      textClass = styles[`val${cellData.neighborMines}`] || '';
    }
  } else if (cellData.state === CELL_STATE.FLAGGED) {
    content = '🚩';
  }

  const label = cellData.state === CELL_STATE.FLAGGED
    ? `Row ${row + 1}, column ${col + 1}, flagged`
    : cellData.state === CELL_STATE.OPENED
      ? `Row ${row + 1}, column ${col + 1}, opened`
      : `Row ${row + 1}, column ${col + 1}, closed`;

  return (
    <button
      type="button"
      className={`${cellClass} ${textClass}`}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
      aria-label={label}
    >
      {content}
    </button>
  );
};