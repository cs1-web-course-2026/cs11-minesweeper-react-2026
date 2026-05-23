import styles from "../styles/RestartButton.module.css";

function RestartButton({ onRestart }) {
  return (
    <button
      type="button"
      className={styles.restartButton}
      onClick={onRestart}
      aria-label="Start new game"
    >
      Нова гра
    </button>
  );
}

export default RestartButton;
