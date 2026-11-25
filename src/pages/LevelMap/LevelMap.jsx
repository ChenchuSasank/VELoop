import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Star } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { levelConfig } from '../../data/levels'
import shared from '../../styles/shared.module.css'
import styles from '../Pages.module.css'

export default function LevelMap() {
  const { unlocked, stars } = useProgress()
  const [extra, setExtra] = useState(0)
  const total = Math.max(20, unlocked + 4) + extra
  return (
    <main className="container py-4">
      <h1 className={styles.head}>Level Map</h1>
      <p className={shared.muted}>Win a level to unlock the next one. Scroll up for more levels!</p>
      <div className={styles.map}>
        {Array.from({ length: total }, (_, k) => k + 1).map((n) => {
          const c = levelConfig(n)
          const state = n > unlocked ? 'locked' : n === unlocked ? 'current' : 'done'
          const style = { '--h': c.hue, left: 50 + Math.sin(n * 0.9) * 28 + '%' }
          return state === 'locked' ? (
            <div key={n} className={`${styles.node} ${styles.locked}`} style={style} aria-label={`Level ${n} locked`}><Lock size={18} style={{ margin: '0 auto' }} />{n}</div>
          ) : (
            <Link key={n} to={`/Lvl-Dashboard/play/${n}`} className={`${styles.node} ${state === 'current' ? styles.current : ''}`} style={style} aria-label={`Play level ${n}`}>
              {n}<small>{Array.from({ length: stars[n] || 0 }, (_, s) => <Star key={s} size={10} fill="#ffe08a" color="#ffe08a" />)}</small>
            </Link>
          )
        })}
      </div>
      <button className={shared.ghostBtn} onClick={() => setExtra((e) => e + 10)}>Show more levels</button>
    </main>
  )
}