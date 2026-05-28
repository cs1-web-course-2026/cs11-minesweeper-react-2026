// Компонент Timer — відображення часу гри
// Джерело: React Docs — useEffect Hook
// https://react.dev/reference/react/useEffect

import { useEffect, useRef } from 'react';
import styles from './Timer.module.css';

/**
 * @param {boolean} isRunning - чи запущений таймер
 * @param {number} time - поточний час у секундах
 * @param {function} onTick - callback що викликається кожну секунду
 */
function Timer({ isRunning, time, onTick }) {
  // useRef зберігає ідентифікатор інтервалу між рендерами
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        onTick();
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Функція очищення — зупиняємо таймер при розмонтуванні або зміні isRunning
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return (
    <div className={styles.timer}>
      <span className={styles.icon}>⏱</span>
      <span className={styles.value}>{time}</span>
    </div>
  );
}

export default Timer;
