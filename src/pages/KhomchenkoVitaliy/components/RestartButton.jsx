import React from 'react';
import styles from './RestartButton.module.css';

const RestartButton = ({ onRestart }) => (
  <button type="button" className={styles.restartBtn} onClick={onRestart} aria-label="Restart game">
    👁️
  </button>
);

export default RestartButton;