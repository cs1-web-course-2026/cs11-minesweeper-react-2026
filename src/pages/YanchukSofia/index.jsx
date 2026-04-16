import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import styles from './Minesweeper.module.css';
import { generateField, GAME_STATUS, CELL_STATE, CELL_TYPE } from './gameLogic';

const ROWS = 8;
const COLS = 8;
const MINES = 10;

const Minesweeper = () => {
    const [field, setField] = useState([]);
    const [status, setStatus] = useState(GAME_STATUS.PROCESS);
    const [flagsUsed, setFlagsUsed] = useState(0);
    const [time, setTime] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    const initGame = useCallback(() => {
        setField(generateField(ROWS, COLS, MINES));
        setStatus(GAME_STATUS.PROCESS);
        setFlagsUsed(0);
        setTime(0);
        setTimerActive(false);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    useEffect(() => {
        let interval;
        if (timerActive && status === GAME_STATUS.PROCESS) {
            interval = setInterval(() => setTime(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, status]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleCellClick = (r, c) => {
        if (status !== GAME_STATUS.PROCESS) return;
        if (!timerActive) setTimerActive(true);

        const newField = field.map(row => row.map(cell => ({ ...cell })));
        
        if (newField[r][c].state !== CELL_STATE.CLOSED) return;

        if (newField[r][c].type === CELL_TYPE.MINE) {
            newField[r][c].state = CELL_STATE.OPENED;
            handleEndGame(GAME_STATUS.LOSE, newField);
            return;
        }

        const reveal = (row, col) => {
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
            const cell = newField[row][col];
            if (cell.state !== CELL_STATE.CLOSED) return;

            cell.state = CELL_STATE.OPENED;
            if (cell.neighborMines === 0) {
                for (let ro = -1; ro <= 1; ro++) {
                    for (let co = -1; co <= 1; co++) {
                        reveal(row + ro, col + co);
                    }
                }
            }
        };

        reveal(r, c);
        setField(newField);
        checkWin(newField);
    };

    const handleRightClick = (r, c) => {
        if (status !== GAME_STATUS.PROCESS) return;
        const newField = [...field];
        const cell = { ...newField[r][c] };

        if (cell.state === CELL_STATE.OPENED) return;

        if (cell.state === CELL_STATE.FLAGGED) {
            cell.state = CELL_STATE.CLOSED;
            setFlagsUsed(prev => prev - 1);
        } else if (flagsUsed < MINES) {
            cell.state = CELL_STATE.FLAGGED;
            setFlagsUsed(prev => prev + 1);
        }
        
        newField[r][c] = cell;
        setField(newField);
    };

    const checkWin = (currentField) => {
        let closedEmpty = 0;
        currentField.forEach(row => row.forEach(cell => {
            if (cell.type === CELL_TYPE.EMPTY && cell.state !== CELL_STATE.OPENED) closedEmpty++;
        }));
        if (closedEmpty === 0) handleEndGame(GAME_STATUS.WIN, currentField);
    };

    const handleEndGame = (result, finalField) => {
        setStatus(result);
        setTimerActive(false);
        const revealedField = finalField.map(row => row.map(cell => {
            if (cell.type === CELL_TYPE.MINE) return { ...cell, state: CELL_STATE.OPENED };
            return cell;
        }));
        setField(revealedField);
        
        setTimeout(() => {
            alert(result === GAME_STATUS.WIN ? `🎉 Перемога! Час: ${formatTime(time)}` : '💥 Бум! Ви програли.');
        }, 300);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.minesweeper}>
                <div className={styles.navbar}>
                    <p className={styles['white-text']}><b>Minesweeper</b></p>
                </div>

                <div className={styles['cool-emoji']}>
                    <div className={styles['cool-emoji-background']} onClick={initGame} style={{ cursor: 'pointer' }}>
                        {status === GAME_STATUS.LOSE ? '😵' : status === GAME_STATUS.WIN ? '😎' : '🙂'}
                    </div>
                </div>

                <Board field={field} onCellClick={handleCellClick} onCellRightClick={handleRightClick} />

                <div className={styles['sum-information']}>
                    <p><b>Flags: {flagsUsed}/{MINES}</b></p>
                    <p><b>Time: {formatTime(time)}</b></p>
                </div>
            </div>
        </div>
    );
};

export default Minesweeper;