import { useState, useCallback } from 'react'
import Board from './components/Board'
import Timer from './components/Timer'
import GameStatus from './components/GameStatus'
import RestartButton from './components/RestartButton'
import styles from './Minesweeper.module.css'

const ROWS = 9, COLS = 9, MINES = 10

function createBoard() {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({ row: r, col: c, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 }))
  )
}

function placeMines(board, fr, fc) {
  const b = board.map(r => r.map(c => ({ ...c })))
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!b[r][c].isMine && !(r === fr && c === fc)) { b[r][c].isMine = true; placed++ }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (b[r][c].isMine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].isMine) count++
        }
      b[r][c].adjacentMines = count
    }
  return b
}

function revealCells(board, row, col) {
  const b = board.map(r => r.map(c => ({ ...c })))
  const stack = [[row, col]]
  while (stack.length) {
    const [r, c] = stack.pop()
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
    const cell = b[r][c]
    if (cell.isRevealed || cell.isFlagged) continue
    cell.isRevealed = true
    if (cell.adjacentMines === 0 && !cell.isMine)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          stack.push([r + dr, c + dc])
  }
  return b
}

export default function ChopivskyiDenys() {
  const [board, setBoard] = useState(createBoard)
  const [status, setStatus] = useState('idle')
  const [initialized, setInitialized] = useState(false)

  const restart = useCallback(() => {
    setBoard(createBoard())
    setStatus('idle')
    setInitialized(false)
  }, [])

  const reveal = useCallback((row, col) => {
    setBoard(prev => {
      let b = prev
      if (!initialized) {
        b = placeMines(b, row, col)
        setInitialized(true)
        setStatus('playing')
      }
      if (b[row][col].isFlagged || b[row][col].isRevealed) return prev
      if (b[row][col].isMine) {
        const boom = b.map(r => r.map(c => c.isMine ? { ...c, isRevealed: true } : c))
        setStatus('lost')
        return boom
      }
      const next = revealCells(b, row, col)
      if (next.flat().every(c => c.isMine || c.isRevealed)) setStatus('won')
      return next
    })
  }, [initialized])

  const flag = useCallback((row, col) => {
    setBoard(prev => prev.map((r, ri) =>
      r.map((c, ci) => ri === row && ci === col && !c.isRevealed ? { ...c, isFlagged: !c.isFlagged } : c)
    ))
  }, [])

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>💣 Сапер — Чопівський Денис</h2>
      <div className={styles.header}>
        <Timer running={status === 'playing'} />
        <RestartButton onRestart={restart} />
      </div>
      <GameStatus status={status} />
      <Board board={board} onReveal={reveal} onFlag={flag} />
    </div>
  )
}