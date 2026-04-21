import React, { useState, useEffect } from 'react';
import Board from './Board';

const LEVELS = {
  Beginner: { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
  Intermediate: { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  Expert: { name: 'Expert', rows: 16, cols: 30, mines: 99 },
};



const loadBestScores = () => {
  const savedScores = localStorage.getItem('minesweeper_scores');
  if (savedScores) {
    try {
      return JSON.parse(savedScores);
    } catch (e) {
      console.error("Ошибка парсинга рекордов");
    }
  }
  return { Beginner: null, Intermediate: null, Expert: null };
};

const isCellInBounds = (row, column, rows, cols) => {
  return row >= 0 && row < rows && column >= 0 && column < cols;
};

const createEmptyCellsMatrix = (rows, cols) => {
  let matrix = [];
  for (let row = 0; row < rows; row++) {
    let newRow = [];
    for (let column = 0; column < cols; column++) {
      newRow.push({
        value: 0, isRevealed: false, isFlagged: false, 
        isItMine: false, isWronglyFlagged: false, isExploded: false
      });
    }
    matrix.push(newRow);
  }
  return matrix;
};

const insertMines = (matrix, rows, cols, minesCount) => {
  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const column = Math.floor(Math.random() * cols);
    if (!matrix[row][column].isItMine) {
      matrix[row][column].isItMine = true;
      matrix[row][column].value = 'mine';
      minesPlaced++;
    }
  }
};

const insertValues = (matrix, rows, cols) => {
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < cols; column++) {
      if (matrix[row][column].isItMine) continue;
      
      let count = 0;
      for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dColumn = -1; dColumn <= 1; dColumn++) {
          if (dRow === 0 && dColumn === 0) continue;
          const nextRow = row + dRow;
          const nextColumn = column + dColumn;
          if (isCellInBounds(nextRow, nextColumn, rows, cols)) {
            if (matrix[nextRow][nextColumn].isItMine) count++;
          }
        }
      }
      matrix[row][column].value = count;
    }
  }
};

// Главная функция-фабрика: сама собирает и возвращает готовое поле
const generateNewBoard = (rows, cols, minesCount) => {
  let newMatrix = createEmptyCellsMatrix(rows, cols);
  insertMines(newMatrix, rows, cols, minesCount);
  insertValues(newMatrix, rows, cols);
  return newMatrix;
};

const openCellsAroundZero = (matrixCopy, row, column, rows, cols) => {
  openCellLogic(matrixCopy, row - 1, column - 1, rows, cols);
  openCellLogic(matrixCopy, row - 1, column, rows, cols);
  openCellLogic(matrixCopy, row - 1, column + 1, rows, cols);

  openCellLogic(matrixCopy, row, column - 1, rows, cols);
  openCellLogic(matrixCopy, row, column + 1, rows, cols);

  openCellLogic(matrixCopy, row + 1, column - 1, rows, cols);
  openCellLogic(matrixCopy, row + 1, column, rows, cols);
  openCellLogic(matrixCopy, row + 1, column + 1, rows, cols);
};

const openCellLogic = (matrixCopy, row, column, rows, cols) => {
  if (!isCellInBounds(row, column, rows, cols)) return;
  const cell = matrixCopy[row][column];
  if (cell.isRevealed || cell.isFlagged) return;

  cell.isRevealed = true;
  if (cell.value === 0) {
    openCellsAroundZero(matrixCopy, row, column, rows, cols);
  }
};

const revealMapAfterLoseLogic = (matrix) => {
  matrix.forEach(row => {
    row.forEach(cell => {
      if (cell.isItMine && !cell.isFlagged) cell.isRevealed = true;
      else if (!cell.isItMine && cell.isFlagged) cell.isWronglyFlagged = true;
    });
  });
};

// Просто возвращает true или false, не трогая React state
const checkIsGameWonLogic = (matrix, totalMines) => {
  let correctFlags = 0;
  matrix.forEach(row => {
    row.forEach(cell => {
      if (cell.isItMine && cell.isFlagged) correctFlags++;
    });
  });
  return correctFlags === totalMines;
};


// ==========================================
// 📺 REACT КОМПОНЕНТ (ОТВЕЧАЕТ ЗА ЭКРАН И СТЕЙТ)
// ==========================================

const MockGameIndex3 = () => {
  const [level, setLevel] = useState(LEVELS.Beginner);
  const [cellsMatrix, setCellsMatrix] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [bestTimes, setBestTimes] = useState(loadBestScores);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && !gameOver && !gameWon) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, gameOver, gameWon]);

  // --- МЕТОДЫ УПРАВЛЕНИЯ СОСТОЯНИЕМ ---

  const processWin = () => {
    setGameWon(true);
    setIsTimerActive(false);
    setBestTimes(prevTimes => {
      const currentBest = prevTimes[level.name];
      if (currentBest === null || time < currentBest) {
        const newBest = { ...prevTimes, [level.name]: time };
        localStorage.setItem('minesweeper_scores', JSON.stringify(newBest));
        return newBest;
      }
      return prevTimes;
    });
  };

  const processLoss = () => {
    setGameOver(true);
    setIsTimerActive(false);
  };

  const initializeBoard = (currentLevel = level) => {
    // Вызываем нашу внешнюю бизнес-логику!
    const newMatrix = generateNewBoard(currentLevel.rows, currentLevel.cols, currentLevel.mines);
    
    setCellsMatrix(newMatrix);
    setGameOver(false);
    setGameWon(false);
    setFlagsPlaced(0);
    setTime(0);
    setIsTimerActive(false);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const changeDifficulty = (newLevel) => {
    setLevel(newLevel);
    initializeBoard(newLevel);
  };

  // --- ОБРАБОТЧИКИ КЛИКОВ ПО ДОСКЕ ---

  const handleCellClick = (row, column) => {
    if (gameOver || gameWon || cellsMatrix[row][column].isRevealed || cellsMatrix[row][column].isFlagged) return;
    
    if (!isTimerActive) setIsTimerActive(true);

    const newMatrix = cellsMatrix.map(row => row.map(column => ({ ...column })));
    const cell = newMatrix[row][column];

    if (cell.isItMine) {
      cell.isExploded = true;
      cell.isRevealed = true;
      revealMapAfterLoseLogic(newMatrix); // Вызываем внешнюю логику
      
      setCellsMatrix(newMatrix);
      processLoss();
      return;
    }

    openCellLogic(newMatrix, row, column, level.rows, level.cols); // Вызываем внешнюю логику
    setCellsMatrix(newMatrix);
  };

  const handleContextMenu = (e, Irow, Icolumn) => {
    e.preventDefault();
    if (gameOver || gameWon || cellsMatrix[Irow][Icolumn].isRevealed) return;
    
    if (!isTimerActive) setIsTimerActive(true);

    const newMatrix = cellsMatrix.map(row => row.map(column => ({ ...column })));
    const cell = newMatrix[Irow][Icolumn];
    
    cell.isFlagged = !cell.isFlagged;
    setCellsMatrix(newMatrix);

    const currentFlags = flagsPlaced + (cell.isFlagged ? 1 : -1);
    setFlagsPlaced(currentFlags);

    // Вызываем внешнюю логику для проверки победы
    if (checkIsGameWonLogic(newMatrix, level.mines)) {
      processWin();
    }
  };

  if (cellsMatrix.length === 0) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', padding: '20px', userSelect: 'none', color: 'white' }}>
      <h1>Minesweeper - Advanced</h1>
      
      <div style={{ marginBottom: '20px' }}>
        {Object.values(LEVELS).map(lvl => (
          <button 
            key={lvl.name} 
            onClick={() => changeDifficulty(lvl)}
            style={{ 
              margin: '0 5px', 
              fontWeight: level.name === lvl.name ? 'bold' : 'normal', 
              padding: '8px 15px', 
              cursor: 'pointer',
              border: level.name === lvl.name ? '2px solid white' : '1px solid gray',
              background: '#444',
              color: 'white',
              borderRadius: '4px'
            }}
          >
            {lvl.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '22px', marginBottom: '20px', fontFamily: 'monospace' }}>
        <div>🚩 {flagsPlaced} / {level.mines}</div>
        <div>⏱️ {time}s</div>
        <div>🏆 Best: {bestTimes[level.name] !== null ? `${bestTimes[level.name]}s` : '--'}</div>
      </div>

      <h2 style={{ height: '35px', color: gameOver ? '#ff4d4d' : gameWon ? '#388E3C' : 'transparent', margin: '10px 0' }}>
        {gameOver ? 'GAME OVER 💥' : gameWon ? 'YOU WON! 🎉' : ' '}
      </h2>

      <div style={{ width: '100%', marginBottom: '20px' }}>
        <button 
          onClick={() => initializeBoard()} 
          style={{ 
            padding: '10px 25px', 
            fontSize: '16px', 
            cursor: 'pointer',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid gray',
            borderRadius: '5px'
          }}
        >
          Restart Game
        </button>
      </div>
      
      <div style={{ display: 'inline-block', backgroundColor: '#333', padding: '10px', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
        <Board 
          grid={cellsMatrix} 
          onCellClick={handleCellClick} 
          onCellContextMenu={handleContextMenu} 
        />
      </div>
    </div>
  );
};

export default MockGameIndex3;