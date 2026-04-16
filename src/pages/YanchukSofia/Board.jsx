import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

const Board = ({ field, onCellClick, onCellRightClick }) => {
    return (
        <div className={styles['blocks-in-column']}>
            {field.map((row, rIdx) => (
                <div key={rIdx} className={styles['blocks-in-row']}>
                    {row.map((cell, cIdx) => (
                        <Cell 
                            key={`${rIdx}-${cIdx}`} 
                            cell={cell} 
                            onClick={onCellClick}
                            onContextMenu={onCellRightClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;