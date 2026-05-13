import Cell from './Cell'
import styles from './Board.module.css'

export default function Board({ board, onReveal, onFlag }) {
  return (
    <table className={styles.board}>
      <tbody>
        {board.map((row, ri) => (
          <tr key={ri}>
            {row.map(cell => (
              <Cell key={`${cell.row}-${cell.col}`} cell={cell} onReveal={onReveal} onFlag={onFlag} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}