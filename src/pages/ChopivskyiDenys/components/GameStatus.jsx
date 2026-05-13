import styles from './GameStatus.module.css'

const MESSAGES = {
  idle: 'Натисни на клітинку щоб почати',
  playing: 'Гра йде 🎮',
  won: '🎉 Ти виграв!',
  lost: '💥 Ти програв!',
}

export default function GameStatus({ status }) {
  return <div className={styles.status}>{MESSAGES[status]}</div>
}