import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

const Board = ({ field, onCellClick, onCellRightClick }) => {
  return (
    <div 
      className={styles.gameBoard}
      role="grid"
      aria-label="Minesweeper board"
    >
      {field.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            data={cell}
            row={rowIndex}
            col={colIndex}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onRightClick={() => onCellRightClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;