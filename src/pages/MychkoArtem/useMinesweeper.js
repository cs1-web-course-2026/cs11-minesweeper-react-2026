import { useReducer, useEffect } from 'react';
import * as Logic from './gameLogic';


const initGame = (config) => ({
    field: Logic.createEmptyField(config.rows, config.cols),
    status: 'process',
    time: 0,
    startTime: null,
    isFirstClick: true,
    flagsPlaced: 0,
    openedCells: 0,
    config
});

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_GAME': {
            return initGame(state.config);
        }
        case 'TICK': {
            if (state.status !== 'process' || !state.startTime) return state;
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            return { ...state, time: Math.min(elapsed, 999) };
        }
        case 'HANDLE_CLICK': {
            const { r, c } = action;
            const { rows, cols, minesCount } = state.config;

            if (state.status !== 'process' || state.field[r][c].state !== 'closed') return state;

            let currentField = state.field;
            let startTime = state.startTime;
            let isFirst = state.isFirstClick;

            if (isFirst) {
                currentField = Logic.generateMines(currentField, rows, cols, minesCount, r, c);
                isFirst = false;
                startTime = Date.now();
            }

            if (currentField[r][c].type === 'mine') {
                return { 
                    ...state, 
                    field: Logic.revealAllMines(currentField, r, c), 
                    status: 'lose', 
                    startTime: null 
                };
            }

            const { newField, newlyOpenedCount } = Logic.openCellIterative(currentField, r, c, rows, cols);
            const totalOpened = state.openedCells + newlyOpenedCount;
            const isWin = totalOpened === (rows * cols) - minesCount;

            return { 
                ...state, 
                field: newField, 
                openedCells: totalOpened,
                isFirstClick: isFirst, 
                startTime, 
                status: isWin ? 'win' : 'process' 
            };
        }
        case 'TOGGLE_FLAG': {
            const { r, c } = action;
            if (state.status !== 'process' || state.field[r][c].state === 'opened') return state;

            const newField = state.field.map(row => [...row]);
            const isAdding = newField[r][c].state !== 'flagged';
            newField[r][c] = { ...newField[r][c], state: isAdding ? 'flagged' : 'closed' };

            return { 
                ...state, 
                field: newField, 
                flagsPlaced: state.flagsPlaced + (isAdding ? 1 : -1) 
            };
        }
        default: return state;
    }
};

export const useMinesweeper = (initialConfig = { rows: 10, cols: 10, minesCount: 15 }) => {
    const [state, dispatch] = useReducer(gameReducer, initialConfig, initGame);

    useEffect(() => {
        let interval;
        if (state.status === 'process' && !state.isFirstClick) {
            interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
        }
        return () => clearInterval(interval);
    }, [state.status, state.isFirstClick]);

    return { state, dispatch };
};