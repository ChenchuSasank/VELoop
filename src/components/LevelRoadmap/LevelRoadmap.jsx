import { useState, useEffect } from 'react'
import { Check, Lock, Star } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { levelConfig, levelReward } from '../../data/levels'
import shared from '../../styles/shared.module.css'
import styles from './LevelRoadmap.module.css'

const SHOWN = 8

export default function LevelRoadmap({ currentLevel }) {
  const { stars } = useProgress()
  const [selected, setSelected] = useState(currentLevel)
  useEffect(() => { setSelected(currentLevel) }, [currentLevel])

  const start = Math.max(1, currentLevel - 3)
  const range = Array.from({ length: SHOWN }, (_, i) => start + i)
  const info = levelConfig(selected)

  const stateOf = (n) => (n < currentLevel ? 'completed' : n === currentLevel ? 'current' : n === currentLevel + 1 ? 'next' : 'locked')
  const label = { completed: 'Completed', current: 'You Are Here', next: 'Next Goal', locked: 'Locked' }

  return (
    <section className={shared.card} aria-label="Level roadmap">
      <h3 className={shared.cardTitle}>Level Roadmap · Levels {range[0]}–{range[range.length - 1]}</h3>
      <div className={styles.track}>
        {range.map((n) => {
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
        <b>Level {selected} · {info.name}</b>
        <span className={shared.muted}>Goal: {info.goal.label} ({info.goal.amount}) · Reward: {levelReward(selected)}</span>
        {stars[selected] > 0 && (
          <span className={shared.muted}>Your best: {Array.from({ length: stars[selected] }, (_, i) => <Star key={i} size={12} fill="#ffe08a" color="#ffe08a" />)}</span>
        )}
      </div>
    </section>
  )
}