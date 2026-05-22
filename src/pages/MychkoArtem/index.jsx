import React, { useCallback, useMemo, useState } from 'react';
import { useMinesweeper } from './useMinesweeper';
import Board from './components/Board/Board';
import Timer from './components/Timer/Timer';
import RestartButton from './components/RestartButton/RestartButton';
import styles from './index.module.css';

const MychkoArtemGame = () => {
    const { state, dispatch } = useMinesweeper({ rows: 10, cols: 10, minesCount: 15 });
    const { field, status, time, flagsPlaced, config } = state;
    const [isModalDismissed, setIsModalDismissed] = useState(false);
    const showModal = (status === 'win' || status === 'lose') && !isModalDismissed;
    const handleCellClick = useCallback((r, c) => dispatch({ type: 'HANDLE_CLICK', r, c }), [dispatch]);
    const handleCellFlag = useCallback((r, c) => dispatch({ type: 'TOGGLE_FLAG', r, c }), [dispatch]);
    
    const handleRestart = useCallback(() => {
        setIsModalDismissed(false);
        dispatch({ type: 'INIT_GAME' });
    }, [dispatch]);

    const closeModal = () => setIsModalDismissed(true);

    const remainingMines = useMemo(() => 
        Math.max(config.minesCount - flagsPlaced, -99), 
    [config.minesCount, flagsPlaced]);

    if (!field || field.length === 0) return <div>Завантаження...</div>;

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <div className={styles.display} title="Бомби">
                    {remainingMines < 0 ? '-' : ''}
                    {String(Math.abs(remainingMines)).padStart(3, '0')}
                </div>
                
                <RestartButton onClick={handleRestart} />
                
                <Timer time={time} />
            </header>

            <Board 
                field={field} 
                onCellClick={handleCellClick} 
                onCellFlag={handleCellFlag} 
            />

            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div 
                        className={`${styles.modalContent} ${status === 'win' ? styles.modalWin : styles.modalLose}`}
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <h2 className={styles.modalTitle}>
                            {status === 'win' 
                                ? `ПЕРЕМОГА! Твій час: ${time} сек.` 
                                : 'БУМ! Ти підірвався на міні.'}
                        </h2>
                        
                        <div className={styles.modalActions}>
                            <button className={styles.btnModalSecondary} onClick={closeModal}>
                                Подивитись поле
                            </button>
                            <button className={styles.btnModal} onClick={handleRestart}>
                                Почати заново
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MychkoArtemGame;