import { CELL_STATE, CELL_CONTENT, GAME_STATUS } from "./constants";

// --------------------------------------------------------------
// Utility functions for board manipulation and game logic
export function deepCloneBoard(board) {
  const boardCopy = board.map((row) => [
    ...row.map((cell) => ({ ...cell })),
  ]);

  return boardCopy;
}
export function rowCopy(board) {
  return board.map((row) => [...row]);
}
// --------------------------------------------------------------

export function placeMines(board, mineCount, rows, cols) {
  const boardCopy = rowCopy(board);
  let minesPlaced = 0;

  while (minesPlaced < mineCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    if (boardCopy[randomRow][randomCol].type !== CELL_CONTENT.MINE) {
      boardCopy[randomRow][randomCol].type = CELL_CONTENT.MINE;
      minesPlaced++;
    }
  }

  return calculateAdjacencyCount(boardCopy, rows, cols);
}

export function calculateAdjacencyCount(board, rows, cols) {
  const boardCopy = rowCopy(board);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (boardCopy[row][col].type === CELL_CONTENT.MINE) continue;

      let neighbourCount = 0;

      for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
        for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
          const neighbourRow = row + directionalRow;
          const neighbourCol = col + directionalCol;

          if (isInBounds(neighbourRow, neighbourCol, rows, cols)) {
            if (boardCopy[neighbourRow][neighbourCol].type === CELL_CONTENT.MINE) {
              neighbourCount++;
            }
          }
        }
      }

      boardCopy[row][col].neighbourMineCount = neighbourCount;
    }
  }

  return boardCopy;
}

export function isInBounds(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

export function revealCell(board, revealRow, revealCol, rows, cols) {
  const boardCopy = deepCloneBoard(board);

  const cell = boardCopy[revealRow][revealCol];

  if (
    cell.state === CELL_STATE.OPEN ||
    cell.state === CELL_STATE.FLAGGED
  ) {
    return boardCopy;
  }

  cell.state = CELL_STATE.OPEN;

  if (cell.type === CELL_CONTENT.MINE) {
    cell.isClickedMine = true;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const currentCell = boardCopy[row][col];

        if (
          currentCell.type === CELL_CONTENT.MINE &&
          currentCell.state !== CELL_STATE.FLAGGED
        ) {
          currentCell.state = CELL_STATE.OPEN;
        } else if (
          currentCell.type !== CELL_CONTENT.MINE &&
          currentCell.state === CELL_STATE.FLAGGED
        ) {
          currentCell.state = CELL_STATE.OPEN;
          currentCell.isWrongFlag = true;
        }
      }
    }

    return boardCopy;
  }

  if (cell.neighbourMineCount === 0) {
    for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
      for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
        if (directionalRow === 0 && directionalCol === 0) continue;

        const neighbourRow = revealRow + directionalRow;
        const neighbourCol = revealCol + directionalCol;

        if (isInBounds(neighbourRow, neighbourCol, rows, cols)) {
          floodFillReveal(
            boardCopy,
            neighbourRow,
            neighbourCol,
            rows,
            cols
          );
        }
      }
    }
  }

  return boardCopy;
}

function floodFillReveal(board, row, col, rows, cols) {
  const cell = board[row][col];

  if (
    cell.state === CELL_STATE.OPEN ||
    cell.state === CELL_STATE.FLAGGED
  ) {
    return;
  }

  cell.state = CELL_STATE.OPEN;

  if (cell.neighbourMineCount === 0 && cell.type !== CELL_CONTENT.MINE) {
    for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
      for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
        if (directionalRow === 0 && directionalCol === 0) continue;

        const neighbourRow = row + directionalRow;
        const neighbourCol = col + directionalCol;

        if (isInBounds(neighbourRow, neighbourCol, rows, cols)) {
          floodFillReveal(
            board,
            neighbourRow,
            neighbourCol,
            rows,
            cols
          );
        }
      }
    }
  }
}

export function toggleFlag(board, row, col, mineCount, flagsPlaced) {
  const boardCopy = deepCloneBoard(board);

  const cell = boardCopy[row][col];

  if (cell.state === CELL_STATE.OPEN) return { boardCopy, flagsPlaced };

  if (cell.state === CELL_STATE.CLOSED) {
    if (flagsPlaced >= mineCount) return { boardCopy, flagsPlaced };

    cell.state = CELL_STATE.FLAGGED;
    return { boardCopy, flagsPlaced: flagsPlaced + 1 };
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    cell.state = CELL_STATE.CLOSED;
    return { boardCopy, flagsPlaced: flagsPlaced - 1 };
  }

  return { boardCopy, flagsPlaced };
}

export function checkWinCondition(board, rows, cols, mineCount) {
  let openedCellCount = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].state === CELL_STATE.OPEN) {
        openedCellCount++;
      }
    }
  }

  const totalSafeCells = rows * cols - mineCount;
  return openedCellCount === totalSafeCells;
}

export function revealAllMines(board, rows, cols) {
  const boardCopy = deepCloneBoard(board);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = boardCopy[row][col];

      if (cell.type === CELL_CONTENT.MINE && cell.state !== CELL_STATE.FLAGGED) {
        cell.state = CELL_STATE.FLAGGED;
      }
    }
  }

  return boardCopy;
}
