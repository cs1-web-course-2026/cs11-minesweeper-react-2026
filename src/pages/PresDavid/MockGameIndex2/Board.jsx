import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

const Board = ({ grid, onCellClick, onCellContextMenu }) => {
  return (
    <div className={styles.board}>
      {grid.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <Cell 
            key={`${rowIndex}-${colIndex}`} 
            value={cell.value} 
            isRevealed={cell.isRevealed} 
            isFlagged={cell.isFlagged}
            isWronglyFlagged={cell.isWronglyFlagged}
            isExploded={cell.isExploded} // <-- ПЕРЕДАЕМ НОВОЕ СВОЙСТВО
            onClick={() => onCellClick(rowIndex, colIndex)}
            onContextMenu={(e) => onCellContextMenu(e, rowIndex, colIndex)}
          />
        ))
      ))}
    </div>
  );
};

export default Board;