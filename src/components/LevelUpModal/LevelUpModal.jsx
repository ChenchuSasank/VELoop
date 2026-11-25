import badge from '../../assets/level-up-badge.png'
import shared from '../../styles/shared.module.css'
import styles from './LevelUpModal.module.css'

export default function LevelUpModal({ level, onContinue }) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Level up">
      <div className={styles.box}>
        <h2 className={styles.title}>LEVEL UP!</h2>
        <p className={shared.muted}>You've reached</p>
        <img src={badge} alt={`Level ${level.level}`} className={styles.badgeImg} />
        <h3>Level {String(level.level).padStart(2, '0')} · {level.name}</h3>
        <div className={styles.reward}>{level.reward}</div>
        <p className={shared.muted}>Achievement unlocked (demo reward)</p>
        <button className={shared.goldBtn} onClick={onContinue}>Continue</button>
      </div>
    </div>
  )
}