import styles from "../styles/Timer.module.css";

function Timer({ elapsedSeconds }) {
  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerLabel}>⏱️ Час</div>
      <div className={styles.timerValue}>{elapsedSeconds}</div>
    </div>
  );
}

export default Timer;
