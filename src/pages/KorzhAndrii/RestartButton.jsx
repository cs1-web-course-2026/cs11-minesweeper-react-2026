// Компонент RestartButton — кнопка нової гри
import styles from './RestartButton.module.css';

function RestartButton({ onClick }) {
  return (
    <button className={styles.btn} onClick={onClick}>
      Нова гра
    </button>
  );
}

export default RestartButton;
