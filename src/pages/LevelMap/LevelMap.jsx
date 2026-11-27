import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gift, Star, Lock, Play, Target } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { levelConfig, levelReward, nextMilestone, milestones } from '../../data/levels'
import LevelBadge from '../../components/LevelBadge/LevelBadge'
import shared from '../../styles/shared.module.css'
import styles from './LevelMap.module.css'

export default function LevelMap() {
  const { unlocked, completed, stars, xp } = useProgress()
  const [from, setFrom] = useState(Math.max(1, unlocked - 2))
  const [to, setTo] = useState(unlocked + 6)
  const [selected, setSelected] = useState(unlocked)
  const [picked, setPicked] = useState(false)

  const small = typeof window !== 'undefined' && window.innerWidth < 576
  const badgeSize = small ? 110 : 150
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)
  const milestone = nextMilestone(completed)
  const pct = milestone ? Math.min(100, Math.round((completed / milestone.level) * 100)) : 100
  const cur = levelConfig(unlocked)
  const sel = levelConfig(selected)
  const rows = Array.from({ length: to - from + 1 }, (_, k) => from + k)
  const fill = rows.length > 1 ? ((unlocked - from) / (rows.length - 1)) * 100 : 0

  const playLink = `/Lvl-Dashboard/play/${unlocked}${completed > 0 ? '?go=1' : ''}`
  const playLabel = completed === 0 && !stars[1] ? 'Start Level 1' : `Continue Level ${unlocked}`
  const stateOf = (n) => (n < unlocked ? 'done' : n === unlocked ? 'current' : n === unlocked + 1 ? 'next' : 'locked')
  const isMilestone = (n) => milestones.some((m) => m.level === n)
  const pick = (n) => { setSelected(n); setPicked(true) }

  return (
    <main className={`container py-4 ${styles.page}`}>
      <section className={styles.top} style={{ '--h': cur.hue }}>
        <div className={styles.halo} style={{ width: badgeSize * 1.33, height: badgeSize * 1.33 }}><LevelBadge n={unlocked} size={badgeSize} state="current" /></div>
        <div className={styles.topText}>
          <span className={styles.eyebrow}>Your journey</span>
          <h1 className={styles.title}>Level {unlocked} · {cur.name}</h1>
          <div className={styles.chips}>
            <span><b>{completed}</b> levels won</span>
            <span><b>{totalStars}</b> stars</span>
            <span><b>{xp}</b> XP</span>
          </div>
          <Link to={playLink} className={`${shared.goldBtn} ${styles.cta}`}><Play size={16} /> {playLabel}</Link>
          <div className={shared.bar}><div className={shared.fill} style={{ width: pct + '%' }} /></div>
          <p className={styles.sub}>
            {milestone ? `${completed} of ${milestone.level} levels to your next reward: ${milestone.text}` : 'All milestone rewards reached'}
          </p>
        </div>
      </section>

      <div className={styles.layout}>
        <aside className={`${styles.detail} ${picked ? styles.open : ''}`} style={{ '--h': sel.hue }}>
          <span className={styles.eyebrow}>Level details</span>
          <LevelBadge n={selected} size={130} state={stateOf(selected)} />
          <h2>Level {selected} · {sel.name}</h2>
          <div className={styles.facts}>
            <span><Target size={14} /> {sel.goal.label} ({sel.goal.amount})</span>
            <span><Gift size={14} /> Reward: {levelReward(selected)}</span>
            {stars[selected] > 0 && (
              <span>{Array.from({ length: stars[selected] }, (_, i) => <Star key={i} size={14} fill="#ffe08a" color="#ffe08a" />)} best run</span>
            )}
          </div>
          {selected <= unlocked ? (
            <Link to={`/Lvl-Dashboard/play/${selected}`} className={`${shared.goldBtn} ${styles.play}`}><Play size={16} /> {selected < unlocked ? 'Replay level' : 'Play level'}</Link>
          ) : (
            <p className={styles.locked}><Lock size={14} /> Win Level {unlocked} first to unlock this level.</p>
          )}
        </aside>

        <div className={styles.pathWrap}>
          {from > 1 && (
            <button className={shared.ghostBtn} onClick={() => setFrom((f) => Math.max(1, f - 10))}>Show earlier levels (1–{from - 1})</button>
          )}
          <section className={styles.path} style={{ '--fill': fill + '%' }} aria-label="Level journey">
            {rows.map((n, i) => {
              const c = levelConfig(n)
              return (
                <button key={n} id={`lvl-${n}`} className={`${styles.row} ${i % 2 ? styles.flip : ''} ${selected === n ? styles.sel : ''}`} onClick={() => pick(n)} aria-label={`Level ${n}`} style={{ '--h': c.hue }}>
                  <span className={styles.node}><LevelBadge n={n} size={78} state={stateOf(n)} /></span>
                  <span className={styles.label}>
                    <b>Level {n}</b>
                    <small>{c.name}</small>
                    {isMilestone(n) && <em><Gift size={12} /> {levelReward(n)}</em>}
                  </span>
                </button>
              )
            })}
          </section>
          <button className={shared.ghostBtn} onClick={() => setTo((t) => t + 10)}>Show more levels</button>
        </div>
      </div>
    </main>
  )
}