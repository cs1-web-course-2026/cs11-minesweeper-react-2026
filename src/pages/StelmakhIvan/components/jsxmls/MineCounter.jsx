import styles from "../styles/MineCounter.module.css";

function MineCounter({ flagsPlaced, mineCount }) {
  return (
    <div className={styles.counterContainer}>
      <div className={styles.counterLabel}>🚩 Прапорці</div>
      <div className={styles.counterValue}>
        {flagsPlaced}/{mineCount}
      </div>
    </div>
  );
}

export default MineCounter;
