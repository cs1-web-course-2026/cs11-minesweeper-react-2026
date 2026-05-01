import React, { useState, useEffect } from 'react';
import Board from './Board';

const COLS = 10;
const ROWS = 10;
const MINES_COUNT = 10;

const MockGameIndex2 = () => {
  const [cellsMatrix, setCellsMatrix] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagsPlaced, setFlagsPlaced] = useState(0);

  const isCellInBounds = (row, column) => {
    return row >= 0 && row < ROWS && column >= 0 && column < COLS;
  };

  const createEmptyCellsMatrix = () => {
    let matrix = [];
    for (let row = 0; row < ROWS; row++) {
      let newRowInGrid = [];
      for (let column = 0; column < COLS; column++) {
        newRowInGrid.push({
          value: 0,
          isRevealed: false,
          isFlagged: false,
          isItMine: false,
          isWronglyFlagged: false 
        });
      }
      matrix.push(newRowInGrid); 
    }
    return matrix;
  };

  const insertMines = (matrix) => {
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const row = Math.floor(Math.random() * ROWS);
      const column = Math.floor(Math.random() * COLS);
      if (!matrix[row][column].isItMine) {
        matrix[row][column].isItMine = true;
        matrix[row][column].value = 'mine';
        minesPlaced++;
      }
    }
  };

  const insertValues = (matrix) => {
    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLS; column++) {
        if (matrix[row][column].isItMine) continue;
        let count = 0;
        for (let dRow = -1; dRow <= 1; dRow++) {
          for (let dColumn = -1; dColumn <= 1; dColumn++) {
            if (dRow === 0 && dColumn === 0) continue;
            const newRow = row + dRow;
            const newColumn = column + dColumn;
            if (isCellInBounds(newRow, newColumn)) {
              if (matrix[newRow][newColumn].isItMine) count++;
            }
          }
        }
        matrix[row][column].value = count;
      }
    }
  };

  const initializeBoard = () => {
    let newCellsMatrix = createEmptyCellsMatrix();
    insertMines(newCellsMatrix);
    insertValues(newCellsMatrix);
    
    setCellsMatrix(newCellsMatrix);
    setGameOver(false);
    setGameWon(false);
    setFlagsPlaced(0);
  };

  useEffect(() => {
    initializeBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const openCellsAroundZero = (matrixCopy, row, column) => {
    openCell(matrixCopy, row - 1, column - 1);
    openCell(matrixCopy, row - 1, column);
    openCell(matrixCopy, row - 1, column + 1);
    openCell(matrixCopy, row, column - 1);
    openCell(matrixCopy, row, column + 1);
    openCell(matrixCopy, row + 1, column - 1);
    openCell(matrixCopy, row + 1, column);
    openCell(matrixCopy, row + 1, column + 1);
  };

  const openCell = (matrixCopy, row, column) => {
    if (!isCellInBounds(row, column)) return;
    const cell = matrixCopy[row][column];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    if (cell.value === 0) {
      openCellsAroundZero(matrixCopy, row, column);
    }
  };

  const checkWinCondition = (currentMatrix) => {
    let correctFlags = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLS; column++) {
        if (currentMatrix[row][column].isItMine && currentMatrix[row][column].isFlagged) {
          correctFlags++;
        }
      }
    }
    if (correctFlags === MINES_COUNT) {
      setGameWon(true);
    }
  };

  const revealMapAfterLose = (matrix) => {
    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLS; column++) {
        const cell = matrix[row][column];
        if (cell.isItMine && !cell.isFlagged) {
          cell.isRevealed = true;
        } else if (!cell.isItMine && cell.isFlagged) {
          cell.isWronglyFlagged = true;
        }
      }
    }
  };

  const handleCellClick = (row, column) => {
    if (gameOver || gameWon || cellsMatrix[row][column].isRevealed || cellsMatrix[row][column].isFlagged) return;
    
    // НАСТОЯЩЕЕ ГЛУБОКОЕ КОПИРОВАНИЕ: Копируем каждый отдельный объект-клетку
    const newCellsMatrix = cellsMatrix.map(r => r.map(c => ({ ...c }))); 
    const clickedCell = newCellsMatrix[row][column];

    if (clickedCell.isItMine) {
      clickedCell.isRevealed = true;
      revealMapAfterLose(newCellsMatrix); 
      setCellsMatrix(newCellsMatrix);
      setGameOver(true);
      return; 
    }

    openCell(newCellsMatrix, row, column);
    setCellsMatrix(newCellsMatrix);
  };

  const handleContextMenu = (e, row, column) => {
    e.preventDefault();
    if (gameOver || gameWon || cellsMatrix[row][column].isRevealed) return;
    
    // НАСТОЯЩЕЕ ГЛУБОКОЕ КОПИРОВАНИЕ
    const newCellsMatrix = cellsMatrix.map(r => r.map(c => ({ ...c })));
    const cell = newCellsMatrix[row][column];
    
    cell.isFlagged = !cell.isFlagged;
    setCellsMatrix(newCellsMatrix);

    const newFlagsPlaced = flagsPlaced + (cell.isFlagged ? 1 : -1);
    setFlagsPlaced(newFlagsPlaced);

    if (newFlagsPlaced === MINES_COUNT) {
      checkWinCondition(newCellsMatrix);
    }
  };

  if (cellsMatrix.length === 0) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', padding: '20px', userSelect: 'none' }}>
      <h1>Minesweeper id 2</h1>
      <h2 style={{ height: '30px', color: gameOver ? 'red' : gameWon ? 'green' : 'black' }}>
        {gameOver ? 'GAME OVER' : gameWon ? 'YOU WON!' : ''}
      </h2>
      <button onClick={initializeBoard} style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}>
        Restart Game
      </button>
      <Board grid={cellsMatrix} onCellClick={handleCellClick} onCellContextMenu={handleContextMenu} />
    </div>
  );
};

export default MockGameIndex2;