import React from 'react';
import styles from './Cell.module.css';

function Cell({ row, col, cell, onClick, onRightClick, value }) {
  const getCellClassName = () => {
    if (cell.revealed) {
      if (cell.mine) return `${styles.cell} ${styles.mine}`;
      return `${styles.cell} ${styles.open}`;
    }
    if (cell.flagged) return `${styles.cell} ${styles.flag}`;
    return `${styles.cell} ${styles.closed}`;
  };

  const getAriaLabel = () => {
    if (cell.revealed) {
      if (cell.mine) return `Row ${row + 1}, column ${col + 1}, mine`;
      if (cell.neighborMines > 0) return `Row ${row + 1}, column ${col + 1}, opened, ${cell.neighborMines} adjacent mines`;
      return `Row ${row + 1}, column ${col + 1}, opened, empty`;
    }
    if (cell.flagged) return `Row ${row + 1}, column ${col + 1}, flagged`;
    return `Row ${row + 1}, column ${col + 1}, closed`;
  };

  const handleClick = () => onClick(row, col);
  const handleRightClick = (e) => onRightClick(row, col, e);

  return (
    <button
      type="button"
      className={getCellClassName()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      aria-label={getAriaLabel()}
      data-number={!cell.mine && cell.revealed && cell.neighborMines > 0 ? cell.neighborMines : undefined}
    >
      {value}
    </button>
  );
}

export default Cell;
