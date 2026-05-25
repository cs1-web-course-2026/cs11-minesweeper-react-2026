import { CELL_STATE, CELL_CONTENT, GAME_STATUS } from '../constants/game';

export function createBoard(rows, cols, minesCount) {
  let newBoard = Array(rows).fill().map(() =>
    Array(cols).fill().map(() => ({
      type: CELL_CONTENT.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
    }))
  );

  let placedMines = 0;
  while (placedMines < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (newBoard[row][col].type !== CELL_CONTENT.MINE) {
      newBoard[row][col].type = CELL_CONTENT.MINE;
      placedMines++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newBoard[row][col].type === CELL_CONTENT.MINE) continue;
      let count = 0;
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          const neighborRow = row + rowOffset;
          const neighborCol = col + colOffset;
          if (
            neighborRow >= 0 &&
            neighborRow < rows &&
            neighborCol >= 0 &&
            neighborCol < cols &&
            newBoard[neighborRow][neighborCol].type === CELL_CONTENT.MINE
          ) {
            count++;
          }
        }
      }
      newBoard[row][col].neighborMines = count;
    }
  }
  return newBoard;
}

export function copyBoard(board) {
  return board.map(row => row.map(cell => ({ ...cell })));
}

export function checkWinCondition(board) {
  let closedEmpty = 0;
  board.forEach(row => row.forEach(cell => {
    if (cell.type === CELL_CONTENT.EMPTY && cell.state !== CELL_STATE.OPENED) {
      closedEmpty++;
    }
  }));
  return closedEmpty === 0;
}

export function revealCellLogic(board, row, col, rows, cols) {
  const newBoard = copyBoard(board);

  const floodFill = (currentRow, currentCol) => {
    if (
      currentRow < 0 || currentRow >= rows ||
      currentCol < 0 || currentCol >= cols ||
      newBoard[currentRow][currentCol].state !== CELL_STATE.CLOSED
    ) {
      return;
    }

    newBoard[currentRow][currentCol].state = CELL_STATE.OPENED;

    if (newBoard[currentRow][currentCol].neighborMines === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          floodFill(currentRow + rowOffset, currentCol + colOffset);
        }
      }
    }
  };

  if (newBoard[row][col].type === CELL_CONTENT.MINE) {
    newBoard[row][col].state = CELL_STATE.OPENED;
    newBoard.forEach(r => r.forEach(c => {
      if (c.type === CELL_CONTENT.MINE) c.state = CELL_STATE.OPENED;
    }));
    return { newBoard, newStatus: GAME_STATUS.LOST };
  }

  floodFill(row, col);

  const isWin = checkWinCondition(newBoard);
  return {
    newBoard,
    newStatus: isWin ? GAME_STATUS.WON : GAME_STATUS.PLAYING
  };
}