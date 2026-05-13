import { useState, useEffect } from 'react'
import styles from './Timer.module.css'

export default function Timer({ running }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) { setSeconds(0); return }
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  return <div className={styles.timer}>⏱ {String(seconds).padStart(3, '0')}</div>
}