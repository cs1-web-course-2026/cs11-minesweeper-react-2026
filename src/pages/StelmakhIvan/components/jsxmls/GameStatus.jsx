import {useState} from "react";
import { GAME_STATUS } from "../../hooks/constants";
import dogGif from "../../imgs/dog-with-butterfly-dog-butterfly-meme.gif";
import styles from "../styles/GameStatus.module.css";

function GameStatus({ gameStatus }) {
  const [showOverlay, setShowOverlay] = useState(true);

  const getMessage = () => {
    switch (gameStatus) {
      case GAME_STATUS.WON:
        return "🎉 Перемога! Ви професійний сапер 🎉";

      case GAME_STATUS.LOST:
        return "Kaboom! 💥";

      default:
        return "";
    }
  };

  const getStatusClass = () => {
    switch (gameStatus) {
      case GAME_STATUS.WON:
        return styles.win;

      case GAME_STATUS.LOST:
        return styles.loss;

      default:
        return "";
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const message = getMessage();

  if (!message) {
    return null;
  }

  return (
    <>
      {gameStatus === GAME_STATUS.WON && showOverlay &&(
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <img
              src={dogGif}
              alt="*dog with butterfly gif*"
            />
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleCloseOverlay}
              aria-label="Close overlay"
            >
              ❌
            </button>
            
          </div>
        </div>
      )}
    <p
      className={`${styles.message} ${getStatusClass()}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </p>
    </>
  );
}

export default GameStatus;
