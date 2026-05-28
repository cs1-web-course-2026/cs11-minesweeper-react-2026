import React from 'react';
import styles from './DigitalDisplay.module.css';

export default function DigitalDisplay({ value, digits = 3 }) {
  const str = String(Math.max(0, Math.min(999, value))).padStart(digits, "0");
  return (
    <div className={styles.display}>
      {str.split("").map((d, i) => (
        <span key={i} className={styles.digit}>{d}</span>
      ))}
    </div>
  );
}