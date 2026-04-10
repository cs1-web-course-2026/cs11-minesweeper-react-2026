import { Outlet, NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.layoutHeader}>
        <nav className={styles.layoutNav}>
          <NavLink to="/" className={styles.navBrand}>
            <span className={styles.navBrandIcon}>💣</span>
            <h2>Minesweeper</h2>
          </NavLink>
          <ul className={styles.navLinks}>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/game"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                Implementations
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className={styles.layoutMain}>
        <Outlet />
      </main>

      <footer className={styles.layoutFooter}>
        <p>© 2026 CS-12 Minesweeper Lab. Built with React &amp; Vite.</p>
      </footer>
    </div>
  )
}

export default Layout
