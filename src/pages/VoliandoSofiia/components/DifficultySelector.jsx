import React from 'react';
import styles from './DifficultySelector.module.css';

const DIFFICULTIES = [
  { id: 'easy', name: 'Легкий (10x10)' },
  { id: 'hard', name: 'Складний (16x16)' }
];

function DifficultySelector({ currentDifficulty, onDifficultyChange }) {
  return (
    <div className={styles.difficulty}>
      {DIFFICULTIES.map((diff) => (
        <button
          key={diff.id}
          type="button"
          className={`${styles.difficultyBtn} ${currentDifficulty === diff.id ? styles.active : ''}`}
          onClick={() => onDifficultyChange(diff.id)}
        >
          {diff.name}
        </button>
      ))}
    </div>
  );
}

export default DifficultySelector;
