export const CellStatusVH = { CLOSED: 'closed', OPENED: 'opened', FLAGGED: 'flagged' };
export const CellTypeVH = { EMPTY: 'empty', MINE: 'mine' };
export const GameStatusVH = { PLAYING: 'process', WIN: 'win', LOSE: 'lose' };

export function createBoard(rows, cols) {
  const board = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        type: CellTypeVH.EMPTY,
        state: CellStatusVH.CLOSED,
        neighborMines: 0
      });
    }
    board.push(row);
  }
  return board;
}

export function generateMinesAndNumbers(baseBoard, rows, cols, minesCount, firstRow, firstCol) {
  const boardCopy = baseBoard.map(row => row.map(cell => ({ ...cell })));
  let placedMines = 0;

  while (placedMines < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if ((r !== firstRow || c !== firstCol) && boardCopy[r][c].type !== CellTypeVH.MINE) {
      boardCopy[r][c].type = CellTypeVH.MINE;
      placedMines++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (boardCopy[r][c].type === CellTypeVH.MINE) continue;

      let bombs = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (boardCopy[nr][nc].type === CellTypeVH.MINE) bombs++;
          }
        }
      }
      boardCopy[r][c].neighborMines = bombs;
    }
  }

  return boardCopy;
}

export function revealCells(board, startRow, startCol, rows, cols) {
  const boardCopy = board.map(row => row.map(cell => ({ ...cell })));

  function flood(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (boardCopy[r][c].state !== CellStatusVH.CLOSED || boardCopy[r][c].type === CellTypeVH.MINE) return;

    boardCopy[r][c].state = CellStatusVH.OPENED;

    if (boardCopy[r][c].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          flood(r + dr, c + dc);
        }
      }
    }
  }

  flood(startRow, startCol);
  return boardCopy;
}