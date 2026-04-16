import { CELL_CONTENT, CELL_STATE } from './constants';

export function generateField(rows, cols, minesCount) {
  let field = Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({
      type: CELL_CONTENT.EMPTY, 
      state: CELL_STATE.CLOSED, 
      neighborMines: 0,
    }))
  );

  let placedMines = 0;
  while (placedMines < minesCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (field[r][c].type === CELL_CONTENT.EMPTY) {
      field[r][c].type = CELL_CONTENT.MINE;
      placedMines++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (field[r][c].type === CELL_CONTENT.EMPTY) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
              if (field[r + i][c + j].type === CELL_CONTENT.MINE) count++;
            }
          }
        }
        field[r][c].neighborMines = count;
      }
    }
  }
  return field;
}

export function revealEmptyNeighbors(field, row, col) {
  const rows = field.length;
  const cols = field[0].length;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nr = row + i;
      const nc = col + j;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const cell = field[nr][nc];
        if (cell.state === CELL_STATE.CLOSED && cell.type !== CELL_CONTENT.MINE) {
          cell.state = CELL_STATE.OPENED;
          if (cell.neighborMines === 0) {
            revealEmptyNeighbors(field, nr, nc);
          }
        }
      }
    }
  }
}

export function checkWin(field, minesCount) {
  let closedOrFlagged = 0;
  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field[0].length; c++) {
      if (field[r][c].state !== CELL_STATE.OPENED) {
        closedOrFlagged++;
      }
    }
  }
  return closedOrFlagged === minesCount;
}