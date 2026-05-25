import React from 'react';
import styles from './Minesweeper.module.css';

const Cell = ({ cellData, onClick, onContextMenu }) => {
  let cellClass = `${styles.cell} ${styles.emptyCell}`;
  let content = '';

  if (cellData.state === 'flagged') {
    cellClass = `${styles.cell} ${styles.flagCell}`;
  } else if (cellData.state === 'opened') {
    if (cellData.type === 'mine') {
      cellClass = `${styles.cell} ${styles.bombCell}`;
    } else {
      cellClass = `${styles.cell} ${styles.emptyCellOpened}`;
      if (cellData.neighbourMines > 0) {
        content = <p className={styles.numCell}>{cellData.neighbourMines}</p>;
      }
    }
  }

  return (
    <div
      className={cellClass}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {content}
    </div>
  );
};

export default Cell;