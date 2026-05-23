import { useCallback, useEffect } from "react";
import styles from "./components/styles/StelmakhIvan.module.css";
import { GAME_STATUS, GAME_CONFIG } from "./hooks/constants";
import { useGameState } from "./hooks/useGameState";
import { useTimer } from "./hooks/useTimer";

import Board from "./components/jsxmls/Board";
import Timer from "./components/jsxmls/Timer";
import MineCounter from "./components/jsxmls/MineCounter";
import RestartButton from "./components/jsxmls/RestartButton";
import GameStatus from "./components/jsxmls/GameStatus";

export default function StelmakhIvan() {
  const {
    state,
    restart,
    startGame,
    revealCellAction,
    toggleFlagAction,
    incrementTimer,
  } = useGameState();

  useTimer(state.gameStatus, incrementTimer);

  useEffect(() => {
    if (state.gameStatus === GAME_STATUS.IDLE) {
      startGame();
    }
  }, [state.gameStatus, startGame]);

  const handleCellClick = useCallback(
    (row, col) => {
      revealCellAction(row, col);
    },
    [revealCellAction]
  );

  const handleCellRightClick = useCallback(
    (row, col) => {
      toggleFlagAction(row, col);
    },
    [toggleFlagAction]
  );

  const handleRestart = useCallback(() => {
    restart();
  }, [restart]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏁 САПЕР 🏁</h1>

      <header className={styles.gameHeader}>
        <Timer elapsedSeconds={state.elapsedSeconds} />
        <RestartButton onRestart={handleRestart} />
        <MineCounter
          flagsPlaced={state.flagsPlaced}
          mineCount={GAME_CONFIG.MINES_COUNT}
        />
      </header>

      <main className={styles.gameMain}>
        <Board
          board={state.board}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
        />

        <GameStatus gameStatus={state.gameStatus} />
      </main>
    </div>
  );
}