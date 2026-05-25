// Логіка гри — окремий модуль (відділено від компонентів)
// Джерело: MDN — Array.from, Math.random
// Принцип: логіка не знає нічого про React — це чисті функції

export const ROWS = 10;
export const COLS = 10;
export const MINES_COUNT = 15;

/**
 * Генерує початкове поле rows x cols з minesCount мінами
 */
export function generateField(rows, cols, minesCount) {
  const field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: 'empty',
      state: 'closed',
      neighborMines: 0,
    }))
  );

  let placed = 0;
  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (field[r][c].type !== 'mine') {
      field[r][c].type = 'mine';
      placed++;
    }
  }

  countNeighbourMines(field, rows, cols);
  return field;
}

/**
 * Заповнює neighborMines для кожної не-мінної клітинки
 */
function countNeighbourMines(field, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (field[r][c].type === 'mine') continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (field[nr][nc].type === 'mine') count++;
          }
        }
      }
      field[r][c].neighborMines = count;
    }
  }
}

/**
 * Повертає нове поле після відкриття клітинки (row, col).
 * Не мутує оригінал — повертає копію (immutable підхід для React state).
 * Також повертає статус: 'process' | 'win' | 'lose'
 */
export function openCellInField(field, row, col, rows, cols) {
  // Глибока копія поля
  const newField = field.map(r => r.map(cell => ({ ...cell })));
  let status = 'process';

  function open(r, c) {
    const cell = newField[r][c];
    if (cell.state === 'opened' || cell.state === 'flagged') return;

    if (cell.type === 'mine') {
      cell.state = 'opened';
      cell._isHit = true;
      status = 'lose';
      // Відкриваємо всі міни
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newField[i][j].type === 'mine' && newField[i][j].state !== 'flagged') {
            newField[i][j].state = 'opened';
          }
        }
      }
      return;
    }

    cell.state = 'opened';

    if (cell.neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (newField[nr][nc].state === 'closed') {
              open(nr, nc);
            }
          }
        }
      }
    }
  }

  open(row, col);

  // Перевірка перемоги (тільки якщо не програш)
  if (status === 'process') {
    const won = newField.every(rowArr =>
      rowArr.every(cell => cell.type === 'mine' || cell.state === 'opened')
    );
    if (won) status = 'win';
  }

  return { newField, status };
}

/**
 * Повертає нове поле після встановлення/зняття прапорця
 */
export function toggleFlagInField(field, row, col) {
  const newField = field.map(r => r.map(cell => ({ ...cell })));
  const cell = newField[row][col];
  if (cell.state === 'opened') return newField;
  cell.state = cell.state === 'flagged' ? 'closed' : 'flagged';
  return newField;
}

/**
 * Рахує кількість встановлених прапорців
 */
export function countFlags(field) {
  return field.reduce(
    (sum, row) => sum + row.filter(cell => cell.state === 'flagged').length,
    0
  );
}
