import React, { useState, useEffect } from 'react';
import Board from './Board';

const COLS = 10;
const ROWS = 10;
const MINES_COUNT = 10;

const MinesweeperGame = () => {
  // 1. Состояние игры
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // 2. Функция создания нового поля (Твоя старая функция инициализации)
  const initializeBoard = () => {
    let newGrid = Array(ROWS * COLS).fill(null).map(() => ({
      value: 0,
      isRevealed: false,
      isFlagged: false,
      isMine: false
    }));

    // Расставляем мины рандомно
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const randomIndex = Math.floor(Math.random() * (ROWS * COLS));
      if (!newGrid[randomIndex].isMine) {
        newGrid[randomIndex].isMine = true;
        newGrid[randomIndex].value = 'mine';
        minesPlaced++;
      }
    }

    // Считаем цифры (соседей) для пустых клеток
    for (let i = 0; i < ROWS * COLS; i++) {
      if (newGrid[i].isMine) continue;
      
      let count = 0;
      const row = Math.floor(i / COLS);
      const col = i % COLS;

      // Проверяем всех 8 соседей
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          if (r === 0 && c === 0) continue;
          
          const newRow = row + r;
          const newCol = col + c;
          
          if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
            const neighborIndex = newRow * COLS + newCol;
            if (newGrid[neighborIndex].isMine) {
              count++;
            }
          }
        }
      }
      newGrid[i].value = count;
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
  };

  // Запускаем создание поля при первой загрузке страницы
  useEffect(() => {
    initializeBoard();
  }, []);

  // 3. Обработка клика (Открытие клетки)
  const handleCellClick = (index) => {
    // Если игра окончена или клетка уже открыта/с флагом - ничего не делаем
    if (gameOver || gameWon || grid[index].isRevealed || grid[index].isFlagged) return;

    const newGrid = [...grid]; // Делаем копию массива (правило React!)
    const clickedCell = newGrid[index];

    // Попали на мину
    if (clickedCell.isMine) {
      clickedCell.isRevealed = true;
      setGrid(newGrid);
      setGameOver(true);
      alert('Бууум! Вы проиграли 💥');
      return;
    }

    // Если это цифра
    clickedCell.isRevealed = true;
    setGrid(newGrid);
    
    // (Пока без рекурсивного открытия пустых зон, добавим на следующем шаге)
  };

  // 4. Установка флажка
  const handleContextMenu = (e, index) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[index].isRevealed) return;

    const newGrid = [...grid];
    newGrid[index].isFlagged = !newGrid[index].isFlagged;
    setGrid(newGrid);
  };

  if (grid.length === 0) return <div>Загрузка...</div>;

  return (
    <div style={{ textAlign: 'center', padding: '20px', userSelect: 'none' }}>
      <h1>minesweeper</h1>
      <button 
        onClick={initializeBoard} 
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Перезапустить игру
      </button>
      
      <Board 
        grid={grid} 
        onCellClick={handleCellClick} 
        onCellContextMenu={handleContextMenu} 
      />
    </div>
  );
};

export default MinesweeperGame;