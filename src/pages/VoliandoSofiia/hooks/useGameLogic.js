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

// Допоміжна функція для створення порожньої дошки
const createEmptyBoardWithSize = (rows, cols) => {
  return Array(rows).fill().map(() =>
    Array(cols).fill().map(() => ({
      mine: false,
      revealed: false,
      flagged: false,
      neighborMines: 0
    }))
  );
};

// Допоміжна функція для оновлення однієї клітинки (без мутації)
const updateCell = (board, targetRow, targetCol, updater) => {
  return board.map((boardRow, rowIndex) =>
    boardRow.map((cell, colIndex) => {
      if (rowIndex === targetRow && colIndex === targetCol) {
        return updater(cell);
      }
      return cell;
    })
  );
};

// Допоміжна функція для відкриття клітинки (рекурсивно)
const revealCellRecursive = (board, row, col, rows, cols) => {
  if (row < 0 || row >= rows || col < 0 || col >= cols) return board;
  
  const cell = board[row][col];
  if (cell.revealed || cell.flagged) return board;
  
  let newBoard = updateCell(board, row, col, (c) => ({ ...c, revealed: true }));
  
  if (cell.neighborMines === 0 && !cell.mine) {
    for (let directionRow = -1; directionRow <= 1; directionRow++) {
      for (let directionCol = -1; directionCol <= 1; directionCol++) {
        if (directionRow === 0 && directionCol === 0) continue;
        newBoard = revealCellRecursive(newBoard, row + directionRow, col + directionCol, rows, cols);
      }
    }
  }
  
  return newBoard;
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

  // Ініціалізація дошки при першому рендері
  const [board, setBoard] = useState(() => createEmptyBoardWithSize(10, 10));
  
  const timerRef = useRef(null);

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

  const countNeighbourMines = useCallback((currentBoard, rows, cols) => {
    let newBoard = [...currentBoard];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (newBoard[row][col].mine) continue;

        let mineCount = 0;
        for (let directionRow = -1; directionRow <= 1; directionRow++) {
          for (let directionCol = -1; directionCol <= 1; directionCol++) {
            const neighborRow = row + directionRow;
            const neighborCol = col + directionCol;
            const isValid = neighborRow >= 0 && neighborRow < rows &&
                           neighborCol >= 0 && neighborCol < cols;
            if (isValid && newBoard[neighborRow][neighborCol].mine) {
              mineCount++;
            }
          }
        }
        newBoard = updateCell(newBoard, row, col, (c) => ({ ...c, neighborMines: mineCount }));
      }
    }
    return newBoard;
  }, []);

  const placeMines = useCallback((firstRow, firstCol, currentBoard, rows, cols, totalMines) => {
    let newBoard = [...currentBoard];
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const isFirstClickArea = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1;
      if (!newBoard[row][col].mine && !isFirstClickArea) {
        newBoard = updateCell(newBoard, row, col, (c) => ({ ...c, mine: true }));
        minesPlaced++;
      }
    }
    return countNeighbourMines(newBoard, rows, cols);
  }, [countNeighbourMines]);

  const revealAllMines = useCallback((currentBoard, rows, cols) => {
    let newBoard = [...currentBoard];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (newBoard[row][col].mine) {
          newBoard = updateCell(newBoard, row, col, (c) => ({ ...c, revealed: true }));
        }
      }
    }
    return newBoard;
  }, []);

  const checkWinCondition = useCallback((currentBoard, rows, cols) => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = currentBoard[row][col];
        if (!cell.mine && !cell.revealed) {
          return false;
        }
      }
    }
    return true;
  }, []);

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
        newBoard = placeMines(row, col, newBoard, prev.rows, prev.cols, prev.totalMines);
        newStatus = GAME_STATUS.PLAYING;
        startTimer();
      }

      if (newBoard[row][col].mine) {
        newBoard = revealAllMines(newBoard, prev.rows, prev.cols);
        newStatus = GAME_STATUS.LOST;
        newMessage = '💥 Поразка! Ви програли! 💥';
        stopTimer();
      } else {
        newBoard = revealCellRecursive(newBoard, row, col, prev.rows, prev.cols);
        const isWin = checkWinCondition(newBoard, prev.rows, prev.cols);
        if (isWin) {
          newStatus = GAME_STATUS.WON;
          newMessage = '🎉 Перемога! Ви виграли! 🎉';
          stopTimer();
        }
      }

      setBoard(newBoard);
      return { ...prev, status: newStatus, message: newMessage };
    });
  }, [board, placeMines, startTimer, revealAllMines, checkWinCondition, stopTimer]);

  const handleRightClick = useCallback((row, col, event) => {
    event.preventDefault();
    setGameState(prev => {
      if (prev.status !== GAME_STATUS.PLAYING) return prev;

      const cell = board[row][col];
      if (cell.revealed) return prev;

      let newFlagsPlaced = prev.flagsPlaced;

      if (!cell.flagged) {
        if (newFlagsPlaced < prev.totalMines) {
          const newBoard = updateCell(board, row, col, (c) => ({ ...c, flagged: true }));
          setBoard(newBoard);
          newFlagsPlaced++;
        }
      } else {
        const newBoard = updateCell(board, row, col, (c) => ({ ...c, flagged: false }));
        setBoard(newBoard);
        newFlagsPlaced--;
      }

      return { ...prev, flagsPlaced: newFlagsPlaced };
    });
  }, [board]);

  const handleNewGame = useCallback(() => {
    stopTimer();
    const newBoard = createEmptyBoardWithSize(gameState.rows, gameState.cols);
    setBoard(newBoard);
    setGameState(prev => ({
      ...prev,
      status: GAME_STATUS.IDLE,
      flagsPlaced: 0,
      cellsRevealed: 0,
      seconds: 0,
      message: ''
    }));
  }, [gameState.rows, gameState.cols, stopTimer]);

  const handleDifficultyChange = useCallback((difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    stopTimer();
    
    const newBoard = createEmptyBoardWithSize(settings.rows, settings.cols);
    setBoard(newBoard);
    
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
  }, [stopTimer]);

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
