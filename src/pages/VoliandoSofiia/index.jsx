import React from 'react';
import styles from './Minesweeper.module.css';
import Header from './components/Header';
import Board from './components/Board';
import GameMessage from './components/GameMessage';
import DifficultySelector from './components/DifficultySelector';
import useGameLogic from './hooks/useGameLogic';

function VoliandoSofiiaGame() {
  const {
    gameState,
    board,
    handleCellClick,
    handleRightClick,
    handleNewGame,
    handleDifficultyChange,
    getCellValue
  } = useGameLogic();

  return (
    <div className={styles.container}>
      <Header
        minesCount={gameState.totalMines - gameState.flagsPlaced}
        seconds={gameState.seconds}
        onNewGame={handleNewGame}
      />
      
      <Board
        board={board}
        rows={gameState.rows}
        cols={gameState.cols}
        onCellClick={handleCellClick}
        onCellRightClick={handleRightClick}
        getCellValue={getCellValue}
      />
      
      <GameMessage message={gameState.message} />
      
      <DifficultySelector
        currentDifficulty={gameState.currentDifficulty}
        onDifficultyChange={handleDifficultyChange}
      />
    </div>
  );
}

export default VoliandoSofiiaGame;
