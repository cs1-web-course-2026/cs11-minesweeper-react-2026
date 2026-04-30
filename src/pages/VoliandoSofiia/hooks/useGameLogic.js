import { useState, useCallback, useRef } from 'react';

const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost'
};

const DIFFICULTY_SETTINGS = {
  easy: { rows: 10, cols: 10, mines: 12, name: 'Легкий (10x10)' },
  hard: { rows: 16, cols: 16, mines: 40, name: 'Складний (16x16)' }
};

function useGameLogic() {
  const [gameState, setGameState] = useState({
    rows: 10,
    cols: 10,
    totalMines: 12,
    currentDifficulty: 'easy',
    status: GAME_STATUS.IDLE,
    flagsPlaced: 0,
    cellsRevealed: 0,
    seconds: 0,
    message: ''
  });

  const [board, setBoard] = useState([]);
  const timerRef = useRef(null);
  const firstClickRef = useRef(true);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) stopTimer();
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.status === GAME_STATUS.PLAYING) {
          return { ...prev, seconds: prev.seconds + 1 };
        }
        return prev;
      });
    }, 1000);
  }, [stopTimer]);

  const createEmptyBoard = useCallback(() => {
    const newBoard = [];
    for (let row = 0; row < gameState.rows; row++) {
      newBoard[row] = [];
      for (let col = 0; col < gameState.cols; col++) {
        newBoard[row][col] = {
          mine: false,
          revealed: false,
          flagged: false,
          neighborMines: 0
        };
      }
    }
    return newBoard;
  }, [gameState.rows, gameState.cols]);

  const countNeighbourMines = useCallback((currentBoard) => {
    const newBoard = [...currentBoard];
    for (let row = 0; row < gameState.rows; row++) {
      for (let col = 0; col < gameState.cols; col++) {
        if (newBoard[row][col].mine) continue;

        let mineCount = 0;
        for (let directionRow = -1; directionRow <= 1; directionRow++) {
          for (let directionCol = -1; directionCol <= 1; directionCol++) {
            const neighborRow = row + directionRow;
            const neighborCol = col + directionCol;
            const isValid = neighborRow >= 0 && neighborRow < gameState.rows &&
                           neighborCol >= 0 && neighborCol < gameState.cols;
            if (isValid && newBoard[neighborRow][neighborCol].mine) {
              mineCount++;
            }
          }
        }
        newBoard[row][col].neighborMines = mineCount;
      }
    }
    return newBoard;
  }, [gameState.rows, gameState.cols]);

  const placeMines = useCallback((firstRow, firstCol, currentBoard) => {
    const newBoard = [...currentBoard];
    let minesPlaced = 0;
    while (minesPlaced < gameState.totalMines) {
      const row = Math.floor(Math.random() * gameState.rows);
      const col = Math.floor(Math.random() * gameState.cols);
      const isFirstClickArea = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1;
      if (!newBoard[row][col].mine && !isFirstClickArea) {
        newBoard[row][col].mine = true;
        minesPlaced++;
      }
    }
    return countNeighbourMines(newBoard);
  }, [gameState.rows, gameState.cols, gameState.totalMines, countNeighbourMines]);

  const openCell = useCallback((row, col, currentBoard) => {
    if (row < 0 || row >= gameState.rows || col < 0 || col >= gameState.cols) {
      return currentBoard;
    }

    const newBoard = [...currentBoard];
    const cell = newBoard[row][col];

    if (cell.revealed || cell.flagged) {
      return newBoard;
    }

    cell.revealed = true;

    if (cell.neighborMines === 0 && !cell.mine) {
      for (let directionRow = -1; directionRow <= 1; directionRow++) {
        for (let directionCol = -1; directionCol <= 1; directionCol++) {
          if (directionRow === 0 && directionCol === 0) continue;
          openCell(row + directionRow, col + directionCol, newBoard);
        }
      }
    }

    return newBoard;
  }, [gameState.rows, gameState.cols]);

  const checkWinCondition = useCallback((currentBoard) => {
    let allSafeRevealed = true;
    for (let row = 0; row < gameState.rows; row++) {
      for (let col = 0; col < gameState.cols; col++) {
        const cell = currentBoard[row][col];
        if (!cell.mine && !cell.revealed) {
          allSafeRevealed = false;
          break;
        }
      }
    }
    return allSafeRevealed;
  }, [gameState.rows, gameState.cols]);

  const revealAllMines = useCallback((currentBoard) => {
    const newBoard = [...currentBoard];
    for (let row = 0; row < gameState.rows; row++) {
      for (let col = 0; col < gameState.cols; col++) {
        if (newBoard[row][col].mine) {
          newBoard[row][col].revealed = true;
        }
      }
    }
    return newBoard;
  }, [gameState.rows, gameState.cols]);

  const handleCellClick = useCallback((row, col) => {
    setGameState(prev => {
      if (prev.status !== GAME_STATUS.PLAYING && prev.status !== GAME_STATUS.IDLE) {
        return prev;
      }

      const cell = board[row][col];
      if (cell.revealed || cell.flagged) {
        return prev;
      }

      let newBoard = [...board];
      let newStatus = prev.status;
      let newMessage = prev.message;

      if (prev.status === GAME_STATUS.IDLE) {
        newBoard = placeMines(row, col, newBoard);
        newStatus = GAME_STATUS.PLAYING;
        startTimer();
      }

      if (newBoard[row][col].mine) {
        newBoard = revealAllMines(newBoard);
        newStatus = GAME_STATUS.LOST;
        newMessage = '💥 Поразка! Ви програли! 💥';
        stopTimer();
      } else {
        newBoard = openCell(row, col, newBoard);
        const isWin = checkWinCondition(newBoard);
        if (isWin) {
          newStatus = GAME_STATUS.WON;
          newMessage = '🎉 Перемога! Ви виграли! 🎉';
          stopTimer();
        }
      }

      const revealedCount = newBoard.flat().filter(c => c.revealed && !c.mine).length;
      setBoard(newBoard);
      return { ...prev, status: newStatus, message: newMessage, cellsRevealed: revealedCount };
    });
  }, [board, placeMines, startTimer, revealAllMines, openCell, checkWinCondition, stopTimer]);

  const handleRightClick = useCallback((row, col, event) => {
    event.preventDefault();
    setGameState(prev => {
      if (prev.status !== GAME_STATUS.PLAYING) return prev;

      const cell = board[row][col];
      if (cell.revealed) return prev;

      const newBoard = [...board];
      let newFlagsPlaced = prev.flagsPlaced;

      if (!cell.flagged) {
        if (newFlagsPlaced < prev.totalMines) {
          newBoard[row][col].flagged = true;
          newFlagsPlaced++;
        }
      } else {
        newBoard[row][col].flagged = false;
        newFlagsPlaced--;
      }

      setBoard(newBoard);
      return { ...prev, flagsPlaced: newFlagsPlaced };
    });
  }, [board]);

  const handleNewGame = useCallback(() => {
    stopTimer();
    firstClickRef.current = true;
    const emptyBoard = createEmptyBoard();
    setBoard(emptyBoard);
    setGameState(prev => ({
      ...prev,
      status: GAME_STATUS.IDLE,
      flagsPlaced: 0,
      cellsRevealed: 0,
      seconds: 0,
      message: ''
    }));
  }, [createEmptyBoard, stopTimer]);

  const handleDifficultyChange = useCallback((difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    stopTimer();
    firstClickRef.current = true;
    setGameState({
      rows: settings.rows,
      cols: settings.cols,
      totalMines: settings.mines,
      currentDifficulty: difficulty,
      status: GAME_STATUS.IDLE,
      flagsPlaced: 0,
      cellsRevealed: 0,
      seconds: 0,
      message: ''
    });
    const emptyBoard = createEmptyBoard();
    setBoard(emptyBoard);
  }, [createEmptyBoard, stopTimer]);

  const getCellValue = useCallback((cell) => {
    if (!cell.revealed) return null;
    if (cell.mine) return '💣';
    if (cell.neighborMines > 0) return cell.neighborMines;
    return null;
  }, []);

  return {
    gameState,
    board,
    handleCellClick,
    handleRightClick,
    handleNewGame,
    handleDifficultyChange,
    getCellValue
  };
}

export default useGameLogic;
