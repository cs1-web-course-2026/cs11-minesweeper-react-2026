import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

// --- КОМПОНЕНТ КЛІТИНКИ ---
const Cell = ({ data, onClick, onContextMenu }) => {
    let cellClass = styles.cell;
    if (data.state === 'opened') cellClass += ` ${styles.cellOpened}`;
    if (data.state === 'opened' && data.type === 'mine') cellClass += ` ${styles.mine}`;

    let content = '';
    if (data.state === 'flagged') content = '🚩';
    else if (data.state === 'opened' && data.type === 'mine') content = '💣';
    else if (data.state === 'opened' && data.neighborMines > 0) content = data.neighborMines;

    return (
        <div 
            className={cellClass} 
            onClick={onClick} 
            onContextMenu={onContextMenu}
        >
            {content}
        </div>
    );
};

// --- КОМПОНЕНТ ПОЛЯ ---
const Board = ({ field, onCellClick, onCellContextMenu, rows, cols }) => {
    return (
        <div className={styles.board} style={{ gridTemplateColumns: `repeat(${cols}, 30px)` }}>
            {field.map((row, rIdx) => 
                row.map((cell, cIdx) => (
                    <Cell 
                        key={`${rIdx}-${cIdx}`} 
                        data={cell} 
                        onClick={() => onCellClick(rIdx, cIdx)} 
                        onContextMenu={(e) => onCellContextMenu(e, rIdx, cIdx)} 
                    />
                ))
            )}
        </div>
    );
};

// --- ГОЛОВНИЙ КОМПОНЕНТ ГРИ ---
const Minesweeper = () => {
    const rows = 10, cols = 10, minesCount = 10;
    const [field, setField] = useState([]);
    const [status, setStatus] = useState('process');
    const [flags, setFlags] = useState(0);
    const [time, setTime] = useState(0);

    // Ініціалізація гри
    const initGame = () => {
        let newField = Array(rows).fill().map(() => 
            Array(cols).fill().map(() => ({ type: 'empty', state: 'closed', neighborMines: 0 }))
        );
        
        let placed = 0;
        while (placed < minesCount) {
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * cols);
            if (newField[r][c].type !== 'mine') {
                newField[r][c].type = 'mine';
                placed++;
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (newField[r][c].type === 'mine') continue;
                let count = 0;
                const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
                for (let [dr, dc] of dirs) {
                    let nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newField[nr][nc].type === 'mine') {
                        count++;
                    }
                }
                newField[r][c].neighborMines = count;
            }
        }
        setField(newField);
        setStatus('process');
        setFlags(0);
        setTime(0);
    };

    useEffect(() => { initGame(); }, []);

    useEffect(() => {
        let timerId;
        if (status === 'process') {
            timerId = setInterval(() => setTime(t => t + 1), 1000);
        }
        return () => clearInterval(timerId);
    }, [status]);

    const handleLeftClick = (r, c) => {
        if (status !== 'process' || field[r][c].state !== 'closed') return;
        const newField = [...field];
        
        if (newField[r][c].type === 'mine') {
            newField[r][c].state = 'opened';
            setStatus('lose');
        } else {
            // Спрощена логіка відкриття для React
            newField[r][c].state = 'opened';
            // Перевірка перемоги
            let closedSafe = 0;
            newField.forEach(row => row.forEach(cell => {
                if (cell.type === 'empty' && cell.state === 'closed') closedSafe++;
            }));
            if (closedSafe === 0) setStatus('win');
        }
        setField(newField);
    };

    const handleRightClick = (e, r, c) => {
        e.preventDefault();
        if (status !== 'process' || field[r][c].state === 'opened') return;
        const newField = [...field];
        if (newField[r][c].state === 'closed') {
            newField[r][c].state = 'flagged';
            setFlags(f => f + 1);
        } else {
            newField[r][c].state = 'closed';
            setFlags(f => f - 1);
        }
        setField(newField);
    };

    return (
        <div className={styles.gameContainer}>
            <h2>Minesweeper (React) - Сніжана П'ятецька</h2>
            <div className={styles.header}>
                <div className={styles.display}>{String(minesCount - flags).padStart(3, '0')}</div>
                <button className={styles.startBtn} onClick={initGame}>
                    {status === 'lose' ? '😵' : status === 'win' ? '😎' : '😃'}
                </button>
                <div className={styles.display}>{String(time).padStart(3, '0')}</div>
            </div>
            <Board 
                field={field} 
                rows={rows} cols={cols} 
                onCellClick={handleLeftClick} 
                onCellContextMenu={handleRightClick} 
            />
        </div>
    );
};

export default Minesweeper;