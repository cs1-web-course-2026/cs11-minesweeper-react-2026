import React from 'react';
import styles from './Header.module.css';

function Header({ minesCount, seconds, onNewGame }) {
  return (
    <header className={styles.header}>
      <div className={styles.counter}>
        <span>💣</span>
        <span className={styles.counterValue}>{String(minesCount).padStart(3, '0')}</span>
      </div>
      
      <button
        type="button"
        className={styles.newGame}
        onClick={onNewGame}
        aria-label="New game"
      >
        😊
      </button>
      
      <div className={styles.counter}>
        <span>⏱️</span>
        <span className={styles.counterValue}>{String(seconds).padStart(3, '0')}</span>
      </div>
    </header>
  );
}

export default Header;
