import chest from '../../assets/reward-chest.png'
import { Lock, Info } from 'lucide-react'
import shared from '../../styles/shared.module.css'
import styles from './NextLevelReward.module.css'

export default function NextLevelReward({ reward }) {
  return (
    <section className={`${shared.card} ${styles.wrap}`} aria-label="Next level reward">
      <h3 className={shared.cardTitle}>
        {reward.title}
        <span title="The displayed reward is the next milestone reward for completing levels. Demo values for now."><Info size={14} /></span>
      </h3>
      <div className={styles.chest}><img src={chest} alt="Locked reward chest" width="120" /><Lock size={18} className={styles.lock} /></div>
      <div className={styles.reward}>{reward.text}</div>
      <p className={shared.muted}>{reward.hint}</p>
      <div className={shared.bar}><div className={shared.fill} style={{ width: reward.pct + '%' }} /></div>
      <p className={styles.pct}>{reward.pct}% there</p>
    </section>
  )
}