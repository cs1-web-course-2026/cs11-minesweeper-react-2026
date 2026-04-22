import React, { useState, useEffect, useRef } from 'react';
import Board from './Board';
import styles from './Minesweeper.module.css';

const Minesweeper = () => {
    const [difficulty, setDifficulty] = useState('easy');
    const [grid, setGrid] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [flagsUsed, setFlagsUsed] = useState(0);
    const [timer, setTimer] = useState(0);
    const [status, setStatus] = useState('playing'); 
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    const timerRef = useRef(null);
    const configs = {
        easy: { w: 9, h: 9, m: 10 },
        medium: { w: 16, h: 16, m: 40 },
        hard: { w: 20, h: 20, m: 80 },
        hardcore: { w: 25, h: 25, m: 130 }
    };

    const { w, h, m } = configs[difficulty];

    useEffect(() => { initGame(); }, [difficulty]);

    const initGame = () => {
        clearInterval(timerRef.current);
        setTimer(0);
        setIsGameOver(false);
        setFlagsUsed(0);
        setStatus('playing');

        let minesArray = Array(m).fill(true).concat(Array(w * h - m).fill(false)).sort(() => Math.random() - 0.5);
        let newGrid = [];
        for (let i = 0; i < h; i++) {
            let row = [];
            for (let j = 0; j < w; j++) {
                row.push({
                    r: i, c: j,
                    isMine: minesArray[i * w + j],
                    isOpened: false,
                    isFlagged: false,
                    isExploded: false,
                    neighborMines: 0
                });
            }
            newGrid.push(row);
        }

        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                if (newGrid[r][c].isMine) continue;
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (newGrid[r+i]?.[c+j]?.isMine) count++;
                    }
                }
                newGrid[r][c].neighborMines = count;
            }
        }
        setGrid(newGrid);
    };

    const handleCellClick = (r, c) => {
        if (isGameOver || grid[r][c].isOpened || grid[r][c].isFlagged) return;
        if (timer === 0 && status === 'playing') startTimer();

        let newGrid = [...grid.map(row => [...row])];
        if (newGrid[r][c].isMine) {
            triggerGameOver(newGrid, r, c);
        } else {
            revealCell(newGrid, r, c);
            setGrid(newGrid);
            checkWin(newGrid);
        }
    };

    const revealCell = (tempGrid, r, c) => {
        if (r < 0 || r >= h || c < 0 || c >= w || tempGrid[r][c].isOpened || tempGrid[r][c].isFlagged) return;
        tempGrid[r][c].isOpened = true;
        if (tempGrid[r][c].neighborMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    revealCell(tempGrid, r + i, c + j);
                }
            }
        }
    };

    const handleFlag = (r, c) => {
        if (isGameOver || grid[r][c].isOpened) return;
        let newGrid = [...grid.map(row => [...row])];
        const isAdding = !newGrid[r][c].isFlagged;
        if (isAdding && flagsUsed >= m) return;
        newGrid[r][c].isFlagged = isAdding;
        setFlagsUsed(prev => isAdding ? prev + 1 : prev - 1);
        setGrid(newGrid);
        if (soundEnabled && 'vibrate' in navigator) navigator.vibrate(50);
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    };

    const triggerGameOver = (tempGrid, r, c) => {
        setIsGameOver(true);
        clearInterval(timerRef.current);
        tempGrid[r][c].isExploded = true;
        tempGrid.forEach(row => row.forEach(cell => {
            if (cell.isMine) cell.isOpened = true;
        }));
        setGrid(tempGrid);
        setStatus('lost');
    };

    const checkWin = (tempGrid) => {
        const openedCount = tempGrid.flat().filter(cell => cell.isOpened).length;
        if (openedCount === w * h - m) {
            setIsGameOver(true);
            clearInterval(timerRef.current);
            setStatus('won');
        }
    };

    return (
        <div className={styles.gameWrapper}>
            <div className={styles.gameContainer}>
                <header className={styles.controls}>
                    <select className={styles.difficultySelect} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="easy">Легкий (9x9)</option>
                        <option value="medium">Середній (16x16)</option>
                        <option value="hard">Важкий (20x20)</option>
                        <option value="hardcore">Хардкор ☠️</option>
                    </select>
                    <button className={styles.iconBtn} onClick={() => setSoundEnabled(!soundEnabled)}>
                        {soundEnabled ? '🔊' : '🔇'}
                    </button>
                    <button className={styles.resetBtn} onClick={initGame}>🔄 РЕСТАРТ</button>
                </header>
                <div className={styles.stats}>
                    <div className={styles.stat}>🚩 {String(m - flagsUsed).padStart(2, '0')}</div>
                    <div className={styles.stat}>⏱️ {String(timer).padStart(3, '0')}</div>
                </div>
                <Board grid={grid} width={w} onCellClick={handleCellClick} onCellContextMenu={handleFlag} />
            </div>
            {status !== 'playing' && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h1 style={{ color: status === 'won' ? '#10b981' : '#ef4444' }}>
                            {status === 'won' ? 'ПЕРЕМОГА! 🎉' : 'ГРА ЗАКІНЧЕНА 💥'}
                        </h1>
                        <button className={styles.resetBtn} onClick={initGame}>Грати знову</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Minesweeper;