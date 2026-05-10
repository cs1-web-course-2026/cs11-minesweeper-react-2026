import React from 'react';
import styles from './styles.module.css';

export const Cell = ({ cellData, row, col, onOpen, onFlag }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    onFlag(row, col);
  };

  let cellClass = styles.cell;
  let content = '';
  let textClass = '';

  if (cellData.state === 'opened') {
    cellClass = `${styles.cell} ${styles.cellOpened}`;
    if (cellData.type === 'mine') {
      cellClass = `${cellClass} ${styles.mine}`;
      content = '💣';
    } else if (cellData.neighborMines > 0) {
      content = cellData.neighborMines;
      textClass = styles[`val${cellData.neighborMines}`] || '';
    }
  } else if (cellData.state === 'flagged') {
    content = '🚩';
  }

  return (
    <button
      type="button"
      className={`${cellClass} ${textClass}`}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
      aria-label={`Клітинка ${row}, ${col}`}
    >
      {content}
    </button>
  );
};