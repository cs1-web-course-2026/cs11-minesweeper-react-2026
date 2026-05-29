import { useEffect, useState } from 'react';

import Header from './components/Header/Header';
import Board from './components/Board/Board';
import GameMessage from './components/GameMessage/GameMessage';

import styles from './Minesweeper.module.css';

import {
    generateField,
    openCell,
    toggleFlag,
    checkWin,
    revealMines,
    countFlags,
} from './utils/gameHelpers';

const ROWS = 10;
const COLS = 10;
const MINES = 15;

export default function Minesweeper() {

    const [field, setField] = useState([]);
    const [gameStatus, setGameStatus] = useState('process');
    const [time, setTime] = useState(0);

    useEffect(() => {
        startGame();
    }, []);

    useEffect(() => {

        if (gameStatus !== 'process') {
            return;
        }

        const timer = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);

    }, [gameStatus]);

    function startGame() {

        const newField = generateField(
            ROWS,
            COLS,
            MINES
        );

        setField(newField);
        setGameStatus('process');
        setTime(0);

    }

    function handleCellClick(row, col) {

        if (gameStatus !== 'process') {
            return;
        }

        const newField = openCell(
            field,
            row,
            col,
            ROWS,
            COLS
        );

        const clickedCell = newField[row][col];

        if (clickedCell.type === 'mine') {

            revealMines(newField, ROWS, COLS);

            setField([...newField]);

            setGameStatus('lose');

            return;
        }

        if (
            checkWin(
                newField,
                ROWS,
                COLS,
                MINES
            )
        ) {
            setGameStatus('win');
        }

        setField([...newField]);

    }

    function handleRightClick(event, row, col) {

        event.preventDefault();

        if (gameStatus !== 'process') {
            return;
        }

        const newField = toggleFlag(
            field,
            row,
            col,
            MINES
        );

        setField([...newField]);

    }

    return (
        <div className={styles.container}>

            <Header
                time={time}
                flagsLeft={
                    MINES - countFlags(field)
                }
                onRestart={startGame}
            />

            <Board
                field={field}
                onCellClick={handleCellClick}
                onRightClick={handleRightClick}
            />

            <GameMessage status={gameStatus} />

        </div>
    );
}
