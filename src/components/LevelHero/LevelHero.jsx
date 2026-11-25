import { useState, useEffect } from 'react'
import { Zap, ClipboardList, Flame, Info } from 'lucide-react'
import shared from '../../styles/shared.module.css'
import styles from './LevelHero.module.css'

export default function LevelHero({ level, name, xp, sub, pct, barText, user }) {
  const [animate, setAnimate] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t) }, [])

  return (
    <section className={shared.card} aria-label="Current level">
      <div className={styles.top}>
        <div className={styles.badgeWrap}><div className={styles.badge}><span>LEVEL</span><b>{String(level).padStart(2, '0')}</b></div></div>
        <div className={styles.xpBox}>
          <div className={styles.xp}>{xp.toLocaleString()} XP</div>
          <div className={shared.muted}>
            {sub}
            <span title="Your level is the game level you are on. Win a level to earn XP and unlock the next one. Reward values are demo values."> <Info size={14} /></span>
          </div>
          <div className={styles.name}>{name}</div>
        </div>
      </div>

      <div className={shared.bar} role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
        <div className={shared.fill} style={{ width: animate ? pct + '%' : '0%' }} />
      </div>
      <div className={styles.barText}>{barText}</div>

      <h3 className={styles.boostTitle}><Zap size={16} /> Today's Boost</h3>
      <div className={styles.boost}>
        <div><Zap size={20} color="#a58bff" /><b>{user.xpToday} XP</b><small>XP Earned</small></div>
        <div><ClipboardList size={20} color="#e8b84a" /><b>{user.tasksDone} / {user.tasksTotal}</b><small>Tasks Done</small></div>
        <div><Flame size={20} color="#ff8a3d" /><b>{user.streak} Days</b><small>Streak</small></div>
      </div>
    </section>
  )
}