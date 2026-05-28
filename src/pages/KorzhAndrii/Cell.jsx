// Компонент Cell — одна клітинка ігрового поля
// Джерело: React Docs — Components and Props
// https://react.dev/learn/passing-props-to-a-component

import styles from './Cell.module.css';

/**
 * @param {object} cell - дані клітинки { type, state, neighborMines }
 * @param {number} row
 * @param {number} col
 * @param {function} onLeftClick
 * @param {function} onRightClick
 * @param {boolean} gameOver - якщо гра завершена, кліки не обробляємо
 */
function Cell({ cell, row, col, onLeftClick, onRightClick, gameOver }) {
  function handleClick() {
    if (!gameOver) onLeftClick(row, col);
  }

  function handleContextMenu(e) {
    e.preventDefault(); // блокуємо стандартне контекстне меню
    if (!gameOver) onRightClick(row, col);
  }

  // Визначаємо клас та вміст клітинки залежно від стану
  let cellClass = styles.cell;
  let content = null;

  if (cell.state === 'flagged') {
    cellClass += ' ' + styles.flagged;
    content = '🚩';
  } else if (cell.state === 'opened') {
    if (cell.type === 'mine') {
      cellClass += ' ' + styles.mine;
      if (cell._isHit) cellClass += ' ' + styles.mineHit;
      content = '💣';
    } else {
      cellClass += ' ' + styles.opened;
      if (cell.neighborMines > 0) {
        cellClass += ' ' + styles['num' + cell.neighborMines];
        content = cell.neighborMines;
      }
    }
  } else {
    cellClass += ' ' + styles.closed;
  }

  return (
    <div
      className={cellClass}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {content}
    </div>
  );
}

export default Cell;
