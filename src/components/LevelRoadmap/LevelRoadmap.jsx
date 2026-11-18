import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { levels } from '../../data/levelData'
import shared from '../../styles/shared.module.css'
import styles from './LevelRoadmap.module.css'

export default function LevelRoadmap({ currentLevel }) {
  const [selected, setSelected] = useState(currentLevel)
  const info = levels.find((l) => l.level === selected)

  // Work out the state of each level: completed, current, next or locked
  const stateOf = (n) => (n < currentLevel ? 'completed' : n === currentLevel ? 'current' : n === currentLevel + 1 ? 'next' : 'locked')
  const label = { completed: 'Completed', current: 'You Are Here', next: 'Next Goal', locked: 'Locked' }

  return (
    <section className={shared.card} aria-label="Level roadmap">
      <h3 className={shared.cardTitle}>Level Roadmap</h3>
      <div className={styles.track}>
        {levels.map((l) => {
          const s = stateOf(l.level)
          return (
            <button key={l.level} className={`${styles.node} ${styles[s]}`} onClick={() => setSelected(l.level)} aria-pressed={selected === l.level}>
              <span className={styles.circle}>{s === 'completed' ? <Check size={16} /> : s === 'locked' ? <Lock size={14} /> : l.level}</span>
              <b>Level {l.level}</b>
              <small>{label[s]}</small>
            </button>
          )
        })}
      </div>
      <div className={styles.details}>
        <b>Level {info.level} · {info.name}</b>
        <span className={shared.muted}>Needs {info.xp.toLocaleString()} XP · Reward: {info.reward}</span>
      </div>
    </section>
  )
}
