import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

const Board = ({ grid, width, onCellClick, onCellContextMenu }) => {
    return (
        <div 
            className={styles.grid} 
            style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
        >
            {grid.map((row, r) => 
                row.map((cell, c) => (
                    <Cell 
                        key={`${r}-${c}`} 
                        cell={cell} 
                        onClick={() => onCellClick(r, c)}
                        onContextMenu={() => onCellContextMenu(r, c)}
                    />
                ))
            )}
        </div>
    );
};

export default Board;