import { CELL_STATE, CELL_TYPE } from '../../gameLogic';
import styles from './Cell.module.css';

const NUMBER_COLORS = {
  1: 'blue',
  2: 'green',
  3: 'red',
  4: 'navy',
  5: 'brown',
  6: 'teal',
  7: 'black',
  8: 'gray'
};

export default function Cell({ cell, onClick, onRightClick }) {
  let content = '';
  let cellClass = styles.cell;
  let numberColor = {};

  if (cell.state === CELL_STATE.FLAGGED) {
    content = '🚩';
  } else if (cell.state === CELL_STATE.OPENED) {
    cellClass = `${styles.cell} ${styles.opened}`;
    if (cell.type === CELL_TYPE.MINE) {
      content = '💣';
      cellClass = `${styles.cell} ${styles.opened} ${styles.mine}`;
    } else if (cell.neighborMines > 0) {
      content = cell.neighborMines;
      numberColor = { color: NUMBER_COLORS[cell.neighborMines] };
    }
  }

  return (
    <button
      type="button"
      className={cellClass}
      onClick={onClick}
      onContextMenu={onRightClick}
      style={numberColor}
      aria-label={`Cell ${cell.state}`}
    >
      {content}
    </button>
  );
}
