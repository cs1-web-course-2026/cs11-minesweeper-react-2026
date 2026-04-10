import { Link } from 'react-router-dom'

import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <span className={styles.mineIcon} role="img" aria-label="Mine">💣</span>
        <h1>
          Build <span className={styles.heroAccent}>Minesweeper</span>
          <br />with React
        </h1>
        <p className={styles.heroSubtitle}>
          A hands-on React lab for CS-12 students. Implement the classic puzzle game
          using hooks, state management, and modern component architecture.
        </p>
        <div className={styles.heroActions}>
          <Link to="/game" className={styles.primaryBtn}>
            View Implementations →
          </Link>
          <Link to="/about" className={styles.secondaryBtn}>
            How to Play
          </Link>
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.features}>
        <p className={styles.sectionLabel}>What you'll build</p>
        <h2 className={styles.sectionTitle}>Lab 4 Requirements</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon} role="img" aria-label="Game controller">🎮</span>
            <h3>Game Logic</h3>
            <p>Mine placement, number hints, and flood-fill reveal as pure utility functions.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon} role="img" aria-label="Flag">🚩</span>
            <h3>Flag System</h3>
            <p>Right-click to flag mines. Track remaining mine count in real time.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon} role="img" aria-label="React icon">⚛️</span>
            <h3>React Hooks</h3>
            <p>Use useState, useReducer and custom hooks to manage all game state.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon} role="img" aria-label="Accessibility">♿</span>
            <h3>Accessible UI</h3>
            <p>Semantic HTML, ARIA labels, and keyboard-friendly interactions throughout.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
