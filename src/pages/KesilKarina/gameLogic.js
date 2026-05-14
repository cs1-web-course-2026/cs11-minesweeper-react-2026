export const GAME_STATUS = {
  PROCESS: 'process',
  WIN: 'win',
  LOSE: 'lose'
};

export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine'
};

export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged'
};

export function generateField(rows, cols, minesCount) {
  const field = [];
  for (let row = 0; row < rows; row++) {
    const boardRow = [];
    for (let col = 0; col < cols; col++) {
      boardRow.push({
        type: CELL_TYPE.EMPTY,
        state: CELL_STATE.CLOSED,
        neighborMines: 0
      });
    }
    field.push(boardRow);
  }

  let minesLeft = minesCount;
  while (minesLeft > 0) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (field[row][col].type !== CELL_TYPE.MINE) {
      field[row][col].type = CELL_TYPE.MINE;
      minesLeft--;
    }
  }

  return field;
}

export function countNeighborMines(field, rows, cols) {
  const newField = field.map(row => row.map(cell => ({ ...cell })));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newField[row][col].type === CELL_TYPE.EMPTY) {
        let count = 0;
        for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
          for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
            if (deltaRow === 0 && deltaCol === 0) continue;
            const neighborRow = row + deltaRow;
            const neighborCol = col + deltaCol;
            if (
              neighborRow >= 0 && neighborRow < rows &&
              neighborCol >= 0 && neighborCol < cols &&
              newField[neighborRow][neighborCol].type === CELL_TYPE.MINE
            ) {
              count++;
            }
          }
        }
        newField[row][col].neighborMines = count;
      }
    }
  }

  return newField;
}

export function openCell(field, startRow, startCol, rows, cols) {
  // Clone field once, then mutate the clone
  const newField = field.map(row => row.map(cell => ({ ...cell })));
  const stack = [[startRow, startCol]];

  while (stack.length > 0) {
    const [row, col] = stack.pop();

    if (row < 0 || row >= rows || col < 0 || col >= cols) continue;

    const cell = newField[row][col];
    if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) continue;

    newField[row][col] = { ...cell, state: CELL_STATE.OPENED };

    if (cell.neighborMines === 0 && cell.type === CELL_TYPE.EMPTY) {
      for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
          if (deltaRow === 0 && deltaCol === 0) continue;
          stack.push([row + deltaRow, col + deltaCol]);
        }
      }
    }
  }

  return newField;
}

export function revealAllMines(field) {
  return field.map(row =>
    row.map(cell =>
      cell.type === CELL_TYPE.MINE
        ? { ...cell, state: CELL_STATE.OPENED }
        : { ...cell }
    )
  );
}

export function checkWin(field) {
  return field.every(row =>
    row.every(cell =>
      cell.type === CELL_TYPE.MINE || cell.state === CELL_STATE.OPENED
    )
  );
}

export function toggleFlag(field, row, col) {
  return field.map((rowItem, rowIndex) =>
    rowItem.map((cell, columnIndex) => {
      if (rowIndex !== row || columnIndex !== col) return cell;
      if (cell.state === CELL_STATE.CLOSED) return { ...cell, state: CELL_STATE.FLAGGED };
      if (cell.state === CELL_STATE.FLAGGED) return { ...cell, state: CELL_STATE.CLOSED };
      return cell;
    })
  );
}