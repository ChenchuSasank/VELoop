import { Lock, Check } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { milestones } from '../../data/levels'
import shared from '../../styles/shared.module.css'
import styles from '../Pages.module.css'

export default function Rewards() {
  const { completed, xp } = useProgress()
  return (
    <main className="container py-4" style={{ maxWidth: 640 }}>
      <h1 className={styles.head}>Rewards</h1>
      <p className={shared.muted}>Milestone rewards for completing levels. Demo values. XP earned from levels: <b>{xp}</b></p>
      {milestones.map((m) => {
        const got = completed >= m.level
        return (
          <div key={m.level} className={styles.row} style={{ opacity: got ? 1 : 0.6 }}>
            <div><b>Complete Level {m.level}</b><div className={shared.muted}>{m.text}</div></div>
            <span className={got ? styles.done : ''}>{got ? <Check /> : <Lock size={18} />}</span>
          </div>
        )
      })}
    </main>
  )
}