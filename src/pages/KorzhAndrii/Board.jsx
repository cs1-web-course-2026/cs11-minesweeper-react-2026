// Компонент Board — сітка ігрового поля
// Джерело: React Docs — Rendering Lists
// https://react.dev/learn/rendering-lists

import Cell from './Cell';
import styles from './Board.module.css';

function Board({ field, onLeftClick, onRightClick, gameOver, cols }) {
  return (
    <div
      className={styles.board}
      style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}
    >
      {field.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            row={r}
            col={c}
            onLeftClick={onLeftClick}
            onRightClick={onRightClick}
            gameOver={gameOver}
          />
        ))
      )}
    </div>
  );
}

export default Board;
