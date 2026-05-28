import styles from './Header.module.css';

export default function Header({
    time,
    flagsLeft,
    onRestart,
}) {

    return (
        <div className={styles.header}>

            <div className={styles.info}>
                <span>Час</span>
                <strong>{time}</strong>
            </div>

            <button
                className={styles.button}
                onClick={onRestart}
            >
                Нова гра
            </button>

            <div className={styles.info}>
                <span>Прапорці</span>
                <strong>{flagsLeft}</strong>
            </div>

        </div>
    );
}
