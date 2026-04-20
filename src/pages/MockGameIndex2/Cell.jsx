import React from 'react';
import styles from './Minesweeper.module.css';

// Функция, которая выдает нужный цвет для каждой цифры
const getNumberColor = (number) => {
  switch (number) {
    case 1: return '#1976D2'; // Синий
    case 2: return '#388E3C'; // Зеленый
    case 3: return '#D32F2F'; // Красный
    case 4: return '#7B1FA2'; // Фиолетовый
    case 5: return '#FF8F00'; // Оранжевый
    case 6: return '#0097A7'; // Бирюзовый
    case 7: return '#424242'; // Темно-серый
    case 8: return '#000000'; // Черный
    default: return 'inherit';
  }
};

const Cell = ({ value, isRevealed, isFlagged, onClick, onContextMenu }) => {
  let displayContent = '';
  let contentColor = 'inherit'; // Цвет по умолчанию
  
  if (isRevealed) {
    displayContent = value === 'mine' ? '💣' : (value > 0 ? value : '');
    // Если это открытая цифра, получаем для неё цвет
    if (value > 0 && value !== 'mine') {
      contentColor = getNumberColor(value);
    }
  } else if (isFlagged) {
    displayContent = '🚩';
  }

  return (
    <div 
      className={`${styles.cell} ${isRevealed ? styles.revealed : ''}`} 
      onClick={onClick} 
      onContextMenu={onContextMenu}
      // Применяем цвет прямо к стилям ячейки
      style={{ color: contentColor }} 
    >
      {displayContent}
    </div>
  );
};

export default Cell;