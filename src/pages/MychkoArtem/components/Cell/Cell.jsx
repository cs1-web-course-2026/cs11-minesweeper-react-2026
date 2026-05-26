import React, { memo, useCallback } from 'react';
import styles from './Cell.module.css';

const MINE_SVG = (
    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
        <circle cx="11" cy="13" r="9"/>
        <path d="m19.5 9.5 1.8-1.8a2.4 2.4 0 0 0 0-3.4 1-1.6-1.6a2.41 2.41 0 0 0-3.4 0l-1.8 1.8"/>
        <path d="m22 2-1.5 1.5"/>
    </svg>
);

const FLAG_SVG = (
    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
        <line x1="4" x2="4" y1="22" y2="15"/>
    </svg>
);

const Cell = memo(({ data, r, c, onCellClick, onCellFlag }) => {
    const { state, type, neighborMines, exploded } = data;

    const renderContent = () => {
        if (state === 'flagged') return FLAG_SVG;
        if (state === 'opened') {
            if (type === 'mine') return MINE_SVG;
            return neighborMines > 0 ? neighborMines : '';
        }
        return '';
    };

    const getCellClasses = () => {
        const classes = [styles.cell];
        if (state === 'opened') {
            classes.push(styles.opened);
            if (type === 'mine') {
                classes.push(exploded ? styles.exploded : styles.mineRevealed);
            } else if (neighborMines > 0) {
                classes.push(styles[`num${neighborMines}`]);
            }
        }
        return classes.join(' ');
    };

    const handleClick = useCallback(() => {
    if (state === 'opened') return;
    onCellClick(r, c);
    }, [r, c, onCellClick, state]);

    const handleContextMenu = useCallback((e) => {
        e.preventDefault();
        if (state === 'opened') return;
        onCellFlag(r, c);
    }, [r, c, onCellFlag, state]);

    return (
        <button 
            className={getCellClasses()}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            aria-disabled={state === 'opened'}
            role="gridcell" 
            aria-pressed={state === 'opened'}
            aria-label={`Клітинка рядок ${r + 1}, колонка ${c + 1}. ${state === 'flagged' ? 'Встановлено прапорець' : ''}`}
        >
            {renderContent()}
        </button>
    );
});

export default Cell;