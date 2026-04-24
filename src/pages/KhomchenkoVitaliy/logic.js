import { CELL_CONTENT, CELL_STATE } from './constants';

function getNeighbors(row, col, rows, cols) {
  const neighbors = [];
  for (let directionRow = -1; directionRow <= 1; directionRow++) {
    for (let directionCol = -1; directionCol <= 1; directionCol++) {
      if (directionRow === 0 && directionCol === 0) continue; 
      
      const neighborRow = row + directionRow;
      const neighborCol = col + directionCol;

      if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
        neighbors.push({ row: neighborRow, col: neighborCol });
      }
    }
  }
  return neighbors;
}

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
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * cols);
    
    if (field[row][col].type === CELL_CONTENT.EMPTY) {
      field[row][col].type = CELL_CONTENT.MINE;
      placedMines++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (field[row][col].type === CELL_CONTENT.EMPTY) {
        let count = 0;
        
        const neighbors = getNeighbors(row, col, rows, cols);
        for (let neighbor of neighbors) {
          if (field[neighbor.row][neighbor.col].type === CELL_CONTENT.MINE) {
            count++;
          }
        }
        
        field[row][col].neighborMines = count;
      }
    }
  }
  return field;
}

export function revealEmptyNeighbors(field, row, col) {
  const rows = field.length;
  const cols = field[0].length;
  const neighbors = getNeighbors(row, col, rows, cols);
  
  for (let neighbor of neighbors) {
    const cell = field[neighbor.row][neighbor.col];
    
    if (cell.state === CELL_STATE.CLOSED && cell.type !== CELL_CONTENT.MINE) {
      cell.state = CELL_STATE.OPENED;
      
      if (cell.neighborMines === 0) {
        revealEmptyNeighbors(field, neighbor.row, neighbor.col);
      }
    }
  }
  
  return field;
}

export function checkWin(field, minesCount) {
  let closedOrFlagged = 0;

  for (let row = 0; row < field.length; row++) {
    for (let col = 0; col < field[0].length; col++) {
      if (field[row][col].state !== CELL_STATE.OPENED) {
        closedOrFlagged++;
      }
    }
  }
  return closedOrFlagged === minesCount;
}