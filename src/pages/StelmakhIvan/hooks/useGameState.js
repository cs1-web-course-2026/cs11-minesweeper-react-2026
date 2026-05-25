import { useReducer, useCallback } from "react";
import { GAME_STATUS, GAME_CONFIG } from "./constants";
import {
  createBoard,
  placeMines,
  revealCell,
  toggleFlag,
  checkWinCondition,
  revealAllMines,
} from "./utils";

function createInitialState() {
  const board = createBoard(GAME_CONFIG.ROWS, GAME_CONFIG.COLS);
  const boardWithMines = placeMines(
    board,
    GAME_CONFIG.MINES_COUNT,
    GAME_CONFIG.ROWS,
    GAME_CONFIG.COLS
  );

  return {
    board: boardWithMines,
    gameStatus: GAME_STATUS.IDLE,
    flagsPlaced: 0,
    elapsedSeconds: 0,
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case "RESTART":
      return createInitialState();

    case "START_GAME":
      return {
        ...state,
        gameStatus: GAME_STATUS.PLAYING,
      };

    case "REVEAL_CELL": {
      if (state.gameStatus !== GAME_STATUS.PLAYING) return state;

      const newBoard = revealCell(
        state.board,
        action.payload.row,
        action.payload.col,
        GAME_CONFIG.ROWS,
        GAME_CONFIG.COLS
      );

      const revealedCell =
        newBoard[action.payload.row][action.payload.col];

      if (revealedCell.type === "mine") {
        return {
          ...state,
          board: newBoard,
          gameStatus: GAME_STATUS.LOST,
        };
      }

      const isWon = checkWinCondition(
        newBoard,
        GAME_CONFIG.ROWS,
        GAME_CONFIG.COLS,
        GAME_CONFIG.MINES_COUNT
      );

      if (isWon) {
        const boardWithRevealedMines = revealAllMines(
          newBoard,
          GAME_CONFIG.ROWS,
          GAME_CONFIG.COLS
        );

        return {
          ...state,
          board: boardWithRevealedMines,
          gameStatus: GAME_STATUS.WON,
          flagsPlaced: GAME_CONFIG.MINES_COUNT,
        };
      }

      return {
        ...state,
        board: newBoard,
      };
    }

    case "TOGGLE_FLAG": {
      if (state.gameStatus !== GAME_STATUS.PLAYING) return state;

      const { boardCopy, flagsPlaced } = toggleFlag(
        state.board,
        action.payload.row,
        action.payload.col,
        GAME_CONFIG.MINES_COUNT,
        state.flagsPlaced
      );

      return {
        ...state,
        board: boardCopy,
        flagsPlaced,
      };
    }

    case "INCREMENT_TIMER":
      if (state.gameStatus === GAME_STATUS.PLAYING) {
        return {
          ...state,
          elapsedSeconds: state.elapsedSeconds + 1,
        };
      }
      return state;

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState
  );

  const restart = useCallback(() => {
    dispatch({ type: "RESTART" });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const revealCellAction = useCallback((row, col) => {
    dispatch({
      type: "REVEAL_CELL",
      payload: { row, col },
    });
  }, []);

  const toggleFlagAction = useCallback((row, col) => {
    dispatch({
      type: "TOGGLE_FLAG",
      payload: { row, col },
    });
  }, []);

  const incrementTimer = useCallback(() => {
    dispatch({ type: "INCREMENT_TIMER" });
  }, []);

  return {
    state,
    restart,
    startGame,
    revealCellAction,
    toggleFlagAction,
    incrementTimer,
  };
}
