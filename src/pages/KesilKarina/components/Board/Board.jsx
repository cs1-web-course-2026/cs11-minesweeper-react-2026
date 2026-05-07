import Cell from '../Cell/Cell';
import styles from './Board.module.css';

export default function Board({ board, onCellClick, onCellRightClick }) {
  return (
    <div className={styles.board}>
      {board.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <Cell
            key={`${rowIdx}-${colIdx}`}
            cell={cell}
            onClick={() => onCellClick(rowIdx, colIdx)}
            onRightClick={(e) => {
              e.preventDefault();
              onCellRightClick(rowIdx, colIdx);
            }}
          />
        ))
      )}
    </div>
  );
}
