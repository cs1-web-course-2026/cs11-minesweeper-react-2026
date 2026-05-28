export function createEmptyField(rows, cols) {

    const field = [];

    for (let row = 0; row < rows; row++) {

        const currentRow = [];

        for (let col = 0; col < cols; col++) {

            currentRow.push({
                type: 'empty',
                neighborMines: 0,
                state: 'closed',
            });

        }

        field.push(currentRow);

    }

    return field;
}

export function generateField(
    rows,
    cols,
    minesCount
) {

    const field = createEmptyField(
        rows,
        cols
    );

    let mines = 0;

    while (mines < minesCount) {

        const row =
            Math.floor(Math.random() * rows);

        const col =
            Math.floor(Math.random() * cols);

        if (field[row][col].type !== 'mine') {

            field[row][col].type = 'mine';

            mines++;

        }

    }

    countNeighbourMines(field, rows, cols);

    return field;
}

export function isValidCell(
    row,
    col,
    rows,
    cols
) {

    return (
        row >= 0 &&
        row < rows &&
        col >= 0 &&
        col < cols
    );
}

export function countNeighbourMines(
    field,
    rows,
    cols
) {

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            if (field[row][col].type === 'mine') {
                continue;
            }

            let mines = 0;

            for (let dRow = -1; dRow <= 1; dRow++) {

                for (
                    let dCol = -1;
                    dCol <= 1;
                    dCol++
                ) {

                    const newRow = row + dRow;
                    const newCol = col + dCol;

                    if (
                        isValidCell(
                            newRow,
                            newCol,
                            rows,
                            cols
                        ) &&
                        field[newRow][newCol].type === 'mine'
                    ) {
                        mines++;
                    }

                }

            }

            field[row][col].neighborMines =
                mines;

        }

    }

}

export function openCell(
    currentField,
    row,
    col,
    rows,
    cols
) {

    const field =
        currentField.map(row =>
            row.map(cell => ({ ...cell }))
        );

    function recursiveOpen(r, c) {

        if (
            !isValidCell(r, c, rows, cols)
        ) {
            return;
        }

        const cell = field[r][c];

        if (
            cell.state === 'opened' ||
            cell.state === 'flagged'
        ) {
            return;
        }

        cell.state = 'opened';

        if (cell.type === 'mine') {
            return;
        }

        if (cell.neighborMines === 0) {

            for (
                let dRow = -1;
                dRow <= 1;
                dRow++
            ) {

                for (
                    let dCol = -1;
                    dCol <= 1;
                    dCol++
                ) {

                    if (
                        dRow === 0 &&
                        dCol === 0
                    ) {
                        continue;
                    }

                    recursiveOpen(
                        r + dRow,
                        c + dCol
                    );

                }

            }

        }

    }

    recursiveOpen(row, col);

    return field;
}

export function toggleFlag(
    currentField,
    row,
    col,
    minesCount
) {

    const field =
        currentField.map(row =>
            row.map(cell => ({ ...cell }))
        );

    const cell = field[row][col];

    if (cell.state === 'opened') {
        return field;
    }

    let flags = countFlags(field);

    if (
        cell.state === 'closed' &&
        flags < minesCount
    ) {

        cell.state = 'flagged';

    } else if (
        cell.state === 'flagged'
    ) {

        cell.state = 'closed';

    }

    return field;
}


export function revealMines(
    field,
    rows,
    cols
) {

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            if (
                field[row][col].type === 'mine'
            ) {
                field[row][col].state =
                    'opened';
            }

        }

    }

}

export function checkWin(
    field,
    rows,
    cols,
    mines
) {

    let opened = 0;

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            if (
                field[row][col].state ===
                'opened'
            ) {
                opened++;
            }

        }

    }

    return (
        opened ===
        rows * cols - mines
    );
}

export function countFlags(field) {

    let flags = 0;

    field.forEach(row => {

        row.forEach(cell => {

            if (
                cell.state === 'flagged'
            ) {
                flags++;
            }

        });

    });

    return flags;
}
