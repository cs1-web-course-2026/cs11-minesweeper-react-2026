import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

const Board = ({ grid, onCellClick, onCellContextMenu }) => {
  const colsCount = grid.length > 0 ? grid[0].length : 10;

  return (
    <div 
      className={styles.board}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${colsCount}, 30px)`,
        gap: '2px',
        backgroundColor: '#bdbdbd',
        padding: '10px',
        border: '3px inset #fff',
        borderRadius: '5px'
      }}
    >
      {grid.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <Cell 
            key={`${rowIndex}-${colIndex}`} 
            row={rowIndex}
            col={colIndex}
            value={cell.value} 
            isRevealed={cell.isRevealed} 
            isFlagged={cell.isFlagged}
            isWronglyFlagged={cell.isWronglyFlagged}
            isExploded={cell.isExploded}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onContextMenu={(e) => onCellContextMenu(e, rowIndex, colIndex)}
          />
        ))
      ))}
    </div>
  );
};

export default Board;