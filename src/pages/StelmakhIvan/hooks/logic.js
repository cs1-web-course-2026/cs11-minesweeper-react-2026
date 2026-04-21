import { CELL_STATE, CELL_CONTENT, GAME_STATUS } from "./constants";

export const generateBoard = (rows, cols, minesCount) => {
  let board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_CONTENT.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if (board[r][c].type !== CELL_CONTENT.MINE) {
      board[r][c].type = CELL_CONTENT.MINE;
      minesPlaced++;
    }
  }

  return countNeighbors(board, rows, cols);
};

const countNeighbors = (board, rows, cols) => {
  const newBoard = JSON.parse(JSON.stringify(board));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].type === CELL_CONTENT.MINE) continue;

      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].type === CELL_CONTENT.MINE) {
            count++;
          }
        }
      }
      newBoard[r][c].neighborMines = count;
    }
  }
  return newBoard;
};

export const openCell = (board, r, c, rows, cols) => {
  if (board[r][c].state !== CELL_STATE.CLOSED) return board;

  const newBoard = JSON.parse(JSON.stringify(board));
  
  const reveal = (boardRef, row, col) => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;
    if (boardRef[row][col].state !== CELL_STATE.CLOSED) return;

    boardRef[row][col].state = CELL_STATE.OPEN;

    if (boardRef[row][col].type === CELL_CONTENT.MINE) return;

    if (boardRef[row][col].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          reveal(boardRef, row + dr, col + dc);
        }
      }
    }
  };

  reveal(newBoard, r, c);
  return newBoard;
};