import styles from './Cell.module.css';

export default function Cell({
    cell,
    onClick,
    onRightClick,
}) {

    let className = styles.cell;

    if (cell.state === 'closed') {
        className += ` ${styles.closed}`;
    }

    if (cell.state === 'opened') {
        className += ` ${styles.opened}`;
    }

    if (cell.state === 'flagged') {
        className += ` ${styles.flagged}`;
    }

    return (
        <div
            className={className}
            onClick={onClick}
            onContextMenu={onRightClick}
        >

            {cell.state === 'flagged' && '🚩'}

            {cell.state === 'opened' &&
                cell.type === 'mine' &&
                '💣'}

            {cell.state === 'opened' &&
                cell.type !== 'mine' &&
                cell.neighborMines > 0 &&
                cell.neighborMines}

        </div>
    );
}
