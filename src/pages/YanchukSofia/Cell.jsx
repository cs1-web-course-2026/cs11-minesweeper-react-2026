import React from 'react';
import styles from './Minesweeper.module.css';
import { CELL_STATE, CELL_TYPE } from './gameLogic';

const Cell = ({ cell, onClick, onContextMenu }) => {
    let className = styles['blue-box'];
    let content = '';

    if (cell.state === CELL_STATE.FLAGGED) {
        className = styles['box-flag'];
        content = '🚩';
    } else if (cell.state === CELL_STATE.OPENED) {
        if (cell.type === CELL_TYPE.MINE) {
            className = `${styles['white-box']} ${styles['mine-cell']}`;
            content = '💣';
        } else if (cell.neighborMines > 0) {
            className = styles[`box-number-${Math.min(cell.neighborMines, 3)}`];
            content = <b>{cell.neighborMines}</b>;
        } else {
            className = styles['white-box'];
        }
    }

    return (
        <div 
            className={className} 
            onClick={() => onClick(cell.row, cell.col)}
            onContextMenu={(e) => {
                e.preventDefault();
                onContextMenu(cell.row, cell.col);
            }}
        >
            {content}
        </div>
    );
};

export default Cell;