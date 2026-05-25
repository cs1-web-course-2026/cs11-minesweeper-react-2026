import React from 'react';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';

const Board = ({ field, onCellClick, onCellFlag }) => {
    if (!field || field.length === 0) return null;
    const rows = field.length;
    const cols = field[0].length;

    return (
        <main 
            className={styles.board} 
            style={{ '--cols': cols, '--rows': rows }}
            role="grid"
            aria-label="Minesweeper Board"
        >
            {field.map((row, r) => 
                <div key={`row-${r}`} role="row" style={{ display: 'contents' }}>
                    {row.map((cell, c) => (
                        <Cell 
                            key={`${r}-${c}`} 
                            r={r} c={c}
                            data={cell} 
                            onCellClick={onCellClick}
                            onCellFlag={onCellFlag} 
                        />
                    ))}
                </div>
            )}
        </main>
    );
};
export default Board;