export const GAME_STATUS = { PROCESS: 'process', WIN: 'win', LOSE: 'lose' };
export const CELL_TYPE = { EMPTY: 'empty', MINE: 'mine' };
export const CELL_STATE = { CLOSED: 'closed', OPENED: 'opened', FLAGGED: 'flagged' };

export const generateField = (rows, cols, minesCount) => {
    let field = [];
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            row.push({ type: CELL_TYPE.EMPTY, state: CELL_STATE.CLOSED, neighborMines: 0, row: r, col: c });
        }
        field.push(row);
    }

    let placedMines = 0;
    while (placedMines < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (field[r][c].type !== CELL_TYPE.MINE) {
            field[r][c].type = CELL_TYPE.MINE;
            placedMines++;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (field[r][c].type === CELL_TYPE.MINE) continue;
            let minesAround = 0;
            for (let ro = -1; ro <= 1; ro++) {
                for (let co = -1; co <= 1; co++) {
                    if (r + ro >= 0 && r + ro < rows && c + co >= 0 && c + co < cols && field[r + ro][c + co].type === CELL_TYPE.MINE) {
                        minesAround++;
                    }
                }
            }
            field[r][c].neighborMines = minesAround;
        }
    }
    return field;
};