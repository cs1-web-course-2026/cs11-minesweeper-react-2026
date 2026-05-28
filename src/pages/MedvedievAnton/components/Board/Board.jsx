import Cell from '../Cell/Cell';

import styles from './Board.module.css';

export default function Board({
    field,
    onCellClick,
    onRightClick,
}) {

    return (
        <div className={styles.board}>

            {field.map((row, rowIndex) =>
                row.map((cell, colIndex) => (

                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        onClick={() =>
                            onCellClick(
                                rowIndex,
                                colIndex
                            )
                        }
                        onRightClick={(event) =>
                            onRightClick(
                                event,
                                rowIndex,
                                colIndex
                            )
                        }
                    />

                ))
            )}

        </div>
    );
}
