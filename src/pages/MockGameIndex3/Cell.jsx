import React from 'react';
import styles from './Minesweeper.module.css';

const getNumberColor = (number) => {
  switch (number) {
    case 1: return '#1976D2';
    case 2: return '#388E3C';
    case 3: return '#D32F2F';
    case 4: return '#7B1FA2';
    case 5: return '#FF8F00';
    case 6: return '#0097A7';
    case 7: return '#424242';
    case 8: return '#000000';
    default: return 'inherit';
  }
};

const Cell = ({ value, isRevealed, isFlagged, isWronglyFlagged, isExploded, onClick, onContextMenu }) => {
  
  const getBackgroundColor = () => {
    if (isWronglyFlagged) return '#000000'; 
    if (isRevealed && value === 'mine') return '#ff4d4d'; 
    if (isRevealed) return '#e0e0e0'; 
    return '#bdbdbd'; 
  };
  const getCellSymbol = () => {
    if (isWronglyFlagged) return '❌';
    if (isExploded) return '💥';
    if (isFlagged && !isRevealed) return '🚩';
    if (isRevealed && value === 'mine') return '💣';
    if (isRevealed && value !== 0 && value !== 'mine') return value;
    return ''; // Если ничего не подошло - возвращаем пустоту
  };

  let contentColor = 'inherit';
  if (isRevealed && value > 0 && value !== 'mine') {
    contentColor = getNumberColor(value);
  }

  return (
    <div 
      className={`${styles.cell} ${isRevealed ? styles.revealed : ''}`} 
      onClick={onClick} 
      onContextMenu={onContextMenu}
      style={{ 
        backgroundColor: getBackgroundColor(),
        color: contentColor 
      }}
    >
      {isWronglyFlagged ? '❌' : ''}
      {!isWronglyFlagged && isFlagged && !isRevealed ? '🚩' : ''}
      {!isWronglyFlagged && isExploded ? '💥' : ''}
      {!isWronglyFlagged && isRevealed && value === 'mine' && !isExploded ? '💣' : ''}
      {isRevealed && value !== 0 && value !== 'mine' ? value : ''}
    </div>
  );
};


export default Cell;