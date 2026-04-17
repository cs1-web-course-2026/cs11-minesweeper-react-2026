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
        
        for (let directionRow = -1; directionRow <= 1; directionRow++) {
          for (let directionCol = -1; directionCol <= 1; directionCol++) {
            
            const neighborRow = row + directionRow;
            const neighborCol = col + directionCol;

            if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
              if (field[neighborRow][neighborCol].type === CELL_CONTENT.MINE) {
                count++;
              }
            }
            
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

  for (let directionRow = -1; directionRow <= 1; directionRow++) {
    for (let directionCol = -1; directionCol <= 1; directionCol++) {
      
      const neighborRow = row + directionRow;
      const neighborCol = col + directionCol;

      if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
        const cell = field[neighborRow][neighborCol];
        
        if (cell.state === CELL_STATE.CLOSED && cell.type !== CELL_CONTENT.MINE) {
          cell.state = CELL_STATE.OPENED;
          
          if (cell.neighborMines === 0) {
            revealEmptyNeighbors(field, neighborRow, neighborCol);
          }
        }
      }
    }
  }
  return field;
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