import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

const Board = ({ field, onCellClick, onCellRightClick }) => {
  return (
    <div className={styles.gameBoard}>
      {field.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <Cell
            key={`${rIdx}-${cIdx}`}
            data={cell}
            row={rIdx}
            col={cIdx}
            onClick={() => onCellClick(rIdx, cIdx)}
            onRightClick={() => onCellRightClick(rIdx, cIdx)}
          />
        ))
      )}
    </div>
  );
};

export default Board;