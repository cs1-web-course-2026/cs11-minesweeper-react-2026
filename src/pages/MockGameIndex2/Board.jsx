import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

const Board = ({ grid, onCellClick, onCellContextMenu }) => {
  return (
    <div className={styles.board}>
      {grid.map((cell, index) => (
        <Cell 
          key={index} 
          value={cell.value} 
          isRevealed={cell.isRevealed} 
          isFlagged={cell.isFlagged}
          onClick={() => onCellClick(index)}
          onContextMenu={(e) => onCellContextMenu(e, index)}
        />
      ))}
    </div>
  );
};

export default Board;