import styles from './RestartButton.module.css'

export default function RestartButton({ onRestart }) {
  return <button className={styles.btn} onClick={onRestart}>🔄 Нова гра</button>
}