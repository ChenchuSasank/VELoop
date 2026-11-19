import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { levelConfig, milestones } from '../../data/levels'
import shared from '../../styles/shared.module.css'
import styles from './LevelRoadmap.module.css'

export default function LevelRoadmap({ currentLevel }) {
  const [selected, setSelected] = useState(currentLevel)
  const start = Math.max(1, currentLevel - 2)
  const nodes = Array.from({ length: 8 }, (_, k) => start + k)
  const cfg = levelConfig(selected)
  const reward = milestones.find((m) => m.level === selected)

  const stateOf = (n) => (n < currentLevel ? 'completed' : n === currentLevel ? 'current' : n === currentLevel + 1 ? 'next' : 'locked')
  const label = { completed: 'Completed', current: 'You Are Here', next: 'Next Goal', locked: 'Locked' }

  return (
    <section className={shared.card} aria-label="Level roadmap">
      <h3 className={shared.cardTitle}>Level Roadmap</h3>
      <div className={styles.track}>
        {nodes.map((n) => {
          const s = stateOf(n)
          return (
            <button key={n} className={`${styles.node} ${styles[s]}`} onClick={() => setSelected(n)} aria-pressed={selected === n}>
              <span className={styles.circle}>{s === 'completed' ? <Check size={16} /> : s === 'locked' ? <Lock size={14} /> : n}</span>
              <b>Level {n}</b>
              <small>{label[s]}</small>
            </button>
          )
        })}
      </div>
      <div className={styles.details}>
        <b>Level {selected} · {cfg.name}</b>
        <span className={shared.muted}>Goal: {cfg.goal.label} ({cfg.goal.amount}) · Reward: {reward ? reward.text : 'XP + stars'}</span>
      </div>
    </section>
  )
}