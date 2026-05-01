import React from 'react';
import { CELL_STATE, CELL_CONTENT } from '../constants';
import styles from './Cell.module.css';

const Cell = ({ data, onClick, onRightClick, row, col }) => {
  const isOpened = data.state === CELL_STATE.OPENED;
  const isFlagged = data.state === CELL_STATE.FLAGGED;
  const isMine = data.type === CELL_CONTENT.MINE;

  let classNames = styles.cell;
  if (isOpened) classNames += ` ${styles.cellOpen}`;
  if (isOpened && isMine) classNames += ` ${styles.cellMine}`;
  if (isFlagged) classNames += ` ${styles.cellFlag}`;
  if (isOpened && !isMine && data.neighborMines > 0) {
    classNames += ` ${styles[`number${data.neighborMines}`]}`;
  }

  // Screen Reader Accessibility
  let label = `Row ${row + 1}, column ${col + 1}, `;
  if (isFlagged) label += 'flagged';
  else if (isOpened) {
    label += isMine ? 'mine' : data.neighborMines > 0 ? `opened, ${data.neighborMines} adjacent mines` : 'opened, empty';
  } else {
    label += 'closed';
  }

  return (
    <button
      type="button"
      className={classNames}
      aria-label={label}
      onClick={onClick}
      onContextMenu={(event) => {
        event.preventDefault();
        onRightClick();
      }}
    >
      {isOpened && !isMine && data.neighborMines > 0 ? data.neighborMines : ''}
    </button>
  );
};

export default Cell;