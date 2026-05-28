import React from 'react';
import styles from './Minesweeper.module.css';

const Cell = ({ cell, onClick, onContextMenu }) => {
    const getContent = () => {
        if (cell.isFlagged && !cell.isOpened) return '🚩';
        if (!cell.isOpened) return null;
        if (cell.isMine) return '💣';
        return cell.neighborMines > 0 ? cell.neighborMines : '';
    };

    const getNumColor = (v) => {
        const colors = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#b91c1c'];
        return colors[v - 1] || '';
    };

    return (
        <div 
            className={`${styles.cell} ${cell.isOpened ? styles.opened : ''} ${cell.isExploded ? styles.exploded : ''}`}
            style={{ color: getNumColor(cell.neighborMines) }}
            onClick={onClick}
            onContextMenu={(e) => {
                e.preventDefault();
                onContextMenu();
            }}
        >
            {getContent()}
        </div>
    );
};

export default Cell;