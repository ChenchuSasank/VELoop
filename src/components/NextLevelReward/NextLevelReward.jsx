import chest from '../../assets/reward-chest.png'
import { Lock, Info } from 'lucide-react'
import shared from '../../styles/shared.module.css'
import styles from './NextLevelReward.module.css'

export default function NextLevelReward({ completed, next }) {
  if (!next) return <section className={shared.card}><h3 className={shared.cardTitle}>All milestone rewards unlocked</h3></section>
  const pct = Math.min(100, Math.round((completed / next.level) * 100))
  return (
    <section className={`${shared.card} ${styles.wrap}`} aria-label="Next level reward">
      <h3 className={shared.cardTitle}>
        Level {String(next.level).padStart(2, '0')} Rewards
        <span title="The displayed reward is associated with the next level according to the current reward configuration. Demo values for now."><Info size={14} /></span>
      </h3>
      <div className={styles.chest}><img src={chest} alt="Locked reward chest" width="120" /><Lock size={18} className={styles.lock} /></div>
      <div className={styles.reward}>{next.text}</div>
      <p className={shared.muted}>Complete Level {String(next.level).padStart(2, '0')} to unlock</p>
      <div className={shared.bar}><div className={shared.fill} style={{ width: pct + '%' }} /></div>
      <p className={styles.pct}>{pct}% there</p>
    </section>
  )
}