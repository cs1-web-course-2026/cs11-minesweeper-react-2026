import Cell from "./Cell";
import styles from "../styles/Board.module.css";

function Board({
  board,
  onCellClick,
  onCellRightClick,
}) {
  return (
    <div className={styles.board} role="grid" aria-label="Minesweeper board">
      {board.map((boardRow, row) =>
        boardRow.map((cell, col) => (
          <Cell
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            onCellClick={onCellClick}
            onCellRightClick={onCellRightClick}
          />
        ))
      )}
    </div>
  );
}

export default Board;
