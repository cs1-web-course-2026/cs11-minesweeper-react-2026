// Компонент GameStatus — повідомлення про перемогу/програш
import styles from './GameStatus.module.css';

function GameStatus({ status, time }) {
  if (status === 'process') return null;

  const isWin = status === 'win';

  return (
    <div className={`${styles.status} ${isWin ? styles.win : styles.lose}`}>
      {isWin
        ? `🎉 Перемога! Час: ${time} сек`
        : '💥 Програш! Спробуй ще раз'}
    </div>
  );
}

export default GameStatus;
