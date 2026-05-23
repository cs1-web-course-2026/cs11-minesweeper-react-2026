export const createEmptyField = (rows, cols) => {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ 
            type: 'empty', 
            state: 'closed', 
            neighborMines: 0,
            exploded: false
        }))
    );
};

const copyField = (field) => field.map(row => [...row]);

export const generateMines = (field, rows, cols, minesCount, excludeRow, excludeCol) => {
    let newField = copyField(field);
    let placedMines = 0;
    
    const isSafeZone = (r, c) => {
        return Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1;
    };

    while (placedMines < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        
        if (isSafeZone(r, c) || newField[r][c].type === 'mine') continue;

        newField[r][c] = { ...newField[r][c], type: 'mine' };
        placedMines++;
    }
    return calculateNeighbors(newField, rows, cols);
};

const calculateNeighbors = (field, rows, cols) => {
    let newField = copyField(field);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (newField[r][c].type === 'mine') continue;
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const nr = r + i, nc = c + j;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newField[nr][nc].type === 'mine') count++;
                }
            }
            if (count > 0) {
                newField[r][c] = { ...newField[r][c], neighborMines: count };
            }
        }
    }
    return newField;
};

export const openCellIterative = (field, startR, startC, rows, cols) => {
    let newField = copyField(field);
    const queue = [[startR, startC]];
    const visited = new Set();
    let newlyOpenedCount = 0; 

    while (queue.length > 0) {
        const [r, c] = queue.shift();
        const key = `${r}-${c}`;

        if (r < 0 || r >= rows || c < 0 || c >= cols || visited.has(key)) continue;
        if (newField[r][c].state !== 'closed' || newField[r][c].type === 'mine') continue;

        visited.add(key);
        newField[r][c] = { ...newField[r][c], state: 'opened' };
        newlyOpenedCount++; 

        if (newField[r][c].neighborMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i !== 0 || j !== 0) queue.push([r + i, c + j]);
                }
            }
        }
    }
    return { newField, newlyOpenedCount }; 
};

export const revealAllMines = (field, explodedR, explodedC) => {
    return field.map((row, r) =>
        row.map((cell, c) => {
            if (cell.type === 'mine') {
                const isExploded = r === explodedR && c === explodedC;
                return { ...cell, state: 'opened', exploded: isExploded };
            }
            return cell;
        })
    );
};