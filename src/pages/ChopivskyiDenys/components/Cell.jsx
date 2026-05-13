import styles from './Cell.module.css'

const COLORS = ['', '#1976d2','#388e3c','#d32f2f','#7b1fa2','#b71c1c','#0097a7','#000','#616161']

export default function Cell({ cell, onReveal, onFlag }) {
  function handleClick() { onReveal(cell.row, cell.col) }
  function handleRightClick(e) { e.preventDefault(); onFlag(cell.row, cell.col) }

  let content = ''
  let className = styles.cell

  if (cell.isRevealed) {
    className += ' ' + styles.revealed
    if (cell.isMine) { content = '💣'; className += ' ' + styles.mine }
    else if (cell.adjacentMines > 0) content = cell.adjacentMines
  } else if (cell.isFlagged) {
    content = '🚩'
    className += ' ' + styles.flagged
  }

  return (
    <td className={className} onClick={handleClick} onContextMenu={handleRightClick} style={{ color: COLORS[cell.adjacentMines] }}>
      {content}
    </td>
  )
}