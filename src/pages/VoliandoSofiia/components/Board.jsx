import React from 'react';
import styles from './Board.module.css';
import Cell from './Cell';

function Board({ board, rows, cols, onCellClick, onCellRightClick, getCellValue }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
    gridTemplateRows: `repeat(${rows}, var(--cell-size))`,
    gap: 'var(--cell-gap)'
  };

  return (
    <div className={styles.board} style={gridStyle}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            cell={cell}
            onClick={onCellClick}
            onRightClick={onCellRightClick}
            value={getCellValue(cell)}
          />
        ))
      )}
    </div>
  );
}

export default Board;
