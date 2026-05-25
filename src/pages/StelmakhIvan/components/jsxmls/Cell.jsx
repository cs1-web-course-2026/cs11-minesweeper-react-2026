import { CELL_STATE, CELL_CONTENT } from "../../hooks/constants";
import styles from "../styles/Cell.module.css";

function Cell({ cell, row, col, onCellClick, onCellRightClick }) {
  const handleClick = () => {
    onCellClick(row, col);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    onCellRightClick(row, col);
  };

  const getAriaLabel = () => {
    const rowLabel = row + 1;
    const colLabel = col + 1;

    if (cell.state === CELL_STATE.CLOSED) {
      return `Cell row ${rowLabel}, column ${colLabel}, closed`;
    }

    if (cell.state === CELL_STATE.FLAGGED) {
      return `Cell row ${rowLabel}, column ${colLabel}, flagged`;
    }

    if (cell.type === CELL_CONTENT.MINE) {
      return `Cell row ${rowLabel}, column ${colLabel}, mine revealed`;
    }

    if (cell.neighbourMineCount > 0) {
      return `Cell row ${rowLabel}, column ${colLabel}, ${cell.neighbourMineCount} adjacent mines`;
    }

    return `Cell row ${rowLabel}, column ${colLabel}, empty`;
  };

  const getCellClasses = () => {
    const classList = [styles.cell];

    switch (cell.state) {
      case CELL_STATE.CLOSED:
        classList.push(styles.closed);
        break;

      case CELL_STATE.FLAGGED:
        classList.push(styles.closed);
        classList.push(styles.flagged);
        break;

      case CELL_STATE.OPEN:
        classList.push(styles.revealed);

        if (cell.isWrongFlag) {
          classList.push(styles.wrongFlag);
        }

        if (cell.type === CELL_CONTENT.MINE) {
          classList.push(styles.mine);
          if (cell.isClickedMine) {
            classList.push(styles.clickedMine);
          }
        } else if (cell.neighbourMineCount > 0) {
          classList.push(styles[`number${cell.neighbourMineCount}`]);
        }
        break;

      default:
        break;
    }

    return classList.join(" ");
  };

  const getCellContent = () => {
    if (cell.state === CELL_STATE.FLAGGED) {
      return "🚩";
    }

    if (cell.state === CELL_STATE.OPEN && cell.type === CELL_CONTENT.MINE) {
      return "💣";
    }

    if (cell.state === CELL_STATE.OPEN && cell.isWrongFlag) {
      return "❌";
    }

    if (
      cell.state === CELL_STATE.OPEN &&
      cell.neighbourMineCount > 0
    ) {
      return cell.neighbourMineCount;
    }

    return "";
  };

  return (
    <button
      type="button"
      className={getCellClasses()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      aria-label={getAriaLabel()}
    >
      {getCellContent()}
    </button>
  );
}

export default Cell;