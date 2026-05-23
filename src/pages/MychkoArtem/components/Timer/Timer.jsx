import React from 'react';
import styles from './Timer.module.css';

const Timer = ({ time }) => {
    const displayTime = Math.min(time, 999);
    
    return (
        <div className={styles.display} title="Таймер">
            {String(displayTime).padStart(3, '0')}
        </div>
    );
};

export default Timer;