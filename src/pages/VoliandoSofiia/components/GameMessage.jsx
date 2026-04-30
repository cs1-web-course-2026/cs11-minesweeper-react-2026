import React from 'react';
import styles from './GameMessage.module.css';

function GameMessage({ message }) {
  if (!message) return null;
  
  return (
    <p role="status" aria-live="polite" className={styles.message}>
      {message}
    </p>
  );
}

export default GameMessage;
