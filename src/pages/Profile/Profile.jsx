import { useProgress } from '../../hooks/useProgress'
import { BOOST_UNLOCK } from '../../data/levels'
import shared from '../../styles/shared.module.css'
import styles from '../Pages.module.css'

export default function Profile() {
  const { completed, stars, xp, unlocked, reset } = useProgress()
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)
  return (
    <main className="container py-4" style={{ maxWidth: 640 }}>
      <h1 className={styles.head}>Profile</h1>
      <div className={styles.stats}>
        <div className={styles.stat}><b>{completed}</b>Levels won</div>
        <div className={styles.stat}><b>{unlocked}</b>Current level</div>
        <div className={styles.stat}><b>{totalStars}</b>Stars</div>
        <div className={styles.stat}><b>{xp}</b>Level XP</div>
      </div>
      <h3 className={shared.cardTitle} style={{ marginTop: '1.2rem' }}>Power-ups</h3>
      <div className={styles.row}><span>Shield</span><span className={styles.done}>Unlocked</span></div>
      <div className={styles.row}><span>Slow</span><span className={styles.done}>Unlocked</span></div>
      <div className={styles.row}><span>Boost x2</span><span className={completed >= BOOST_UNLOCK ? styles.done : shared.muted}>{completed >= BOOST_UNLOCK ? 'Unlocked' : `Complete ${BOOST_UNLOCK} levels`}</span></div>
      <button className={shared.ghostBtn} onClick={() => { if (window.confirm('Reset all level progress?')) reset() }}>Reset progress</button>
    </main>
  )
}
