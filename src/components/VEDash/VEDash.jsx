import { useState, useEffect, useRef } from 'react'
import { Info, Heart, Timer, Play, RotateCcw, X } from 'lucide-react'
import orb from '../../assets/xp-orb.png'
import coin from '../../assets/ve-coin.png'
import gem from '../../assets/gem-green.png'
import trophy from '../../assets/trophy-star.png'
import { dashRules } from '../../data/levelData'
import shared from '../../styles/shared.module.css'
import styles from './VEDash.module.css'

const GOOD = [{ img: coin, points: 10 }, { img: coin, points: 10 }, { img: orb, points: 20 }, { img: gem, points: 30 }]

export default function VEDash({ onReward }) {
  const [phase, setPhase] = useState('start')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(dashRules.lives)
  const [combo, setCombo] = useState(0)
  const [time, setTime] = useState(dashRules.seconds)
  const [items, setItems] = useState([])
  const [lane, setLane] = useState(1)
  const [best, setBest] = useState(() => Number(localStorage.getItem('veDashBest') || 0))
  const [reward, setReward] = useState({ xp: 0, ves: 0 })

  const g = useRef({ items: [], score: 0, lives: dashRules.lives, combo: 0, lane: 1, elapsed: 0 })
  const move = (dir) => { g.current.lane = Math.max(0, Math.min(2, g.current.lane + dir)); setLane(g.current.lane) }

  function start() {
    g.current = { items: [], score: 0, lives: dashRules.lives, combo: 0, lane: 1, elapsed: 0 }
    setItems([]); setScore(0); setLives(dashRules.lives); setCombo(0); setLane(1); setTime(dashRules.seconds); setPhase('play')
  }

  function finish() {
    const s = g.current.score
    const xp = Math.min(40, Math.floor(s / 40))
    setReward({ xp, ves: s >= 800 ? 15 : 0 })
    if (s > best) { setBest(s); localStorage.setItem('veDashBest', String(s)) }
    setPhase('result')
    onReward(xp)
  }

  useEffect(() => {
    if (phase !== 'play') return
    let tick = 0
    const loop = setInterval(() => {
      const s = g.current
      tick++
      s.elapsed += 0.04
      const speed = 1.6 + s.elapsed * 0.05
      const gap = Math.max(8, 14 - Math.floor(s.elapsed / 6))
      let next = s.items.map((i) => ({ ...i, y: i.y + speed }))
      if (tick % gap === 0) {
        const hazard = Math.random() < 0.3
        next.push({ id: Math.random(), lane: Math.floor(Math.random() * 3), y: -8, hazard, good: GOOD[Math.floor(Math.random() * GOOD.length)] })
      }
      next = next.filter((i) => {
        if (i.lane !== s.lane || i.y < 72 || i.y > 90) return i.y < 100
        if (i.hazard) { s.lives -= 1; s.combo = 0 }
        else { s.combo += 1; s.score += i.good.points * Math.min(5, 1 + Math.floor(s.combo / 5)) }
        return false
      })
      s.items = next
      setItems(next); setScore(s.score); setLives(s.lives); setCombo(s.combo)
      if (s.lives <= 0) { clearInterval(loop); finish() }
    }, 40)
    return () => clearInterval(loop)
  }, [phase])

  useEffect(() => {
    if (phase !== 'play') return
    if (time <= 0) { finish(); return }
    const t = setTimeout(() => setTime((v) => v - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, time])

  const onTap = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    move(e.clientX - r.left < r.width / 2 ? -1 : 1)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') move(-1)
    if (e.key === 'ArrowRight' || e.key === 'd') move(1)
  }
  const mult = Math.min(5, 1 + Math.floor(combo / 5))

  return (
    <section className={shared.card} aria-label="VE Dash game">
      <h3 className={shared.cardTitle}>VE Dash <span title="A skill game. Switch lanes to collect rewards and dodge blocks. Rewards are demo values."><Info size={14} /></span></h3>

      {phase === 'start' && (
        <div className={styles.panel}>
          <p>Dash down the track. Collect coins, orbs and gems, and dodge the dark blocks. Chain catches for a bigger multiplier!</p>
          <ul className={styles.rules}>
            <li><b>Objective:</b> get the highest score before time or lives run out.</li>
            <li><b>Time and lives:</b> {dashRules.seconds} seconds, {dashRules.lives} lives.</li>
            <li><b>Controls:</b> tap left or right side, or use the arrow keys (or A / D).</li>
            <li><b>Scoring:</b> {dashRules.scoring}</li>
            <li><b>Reward:</b> {dashRules.reward}</li>
            <li><b>How often:</b> {dashRules.plays}</li>
          </ul>
          {best > 0 && <p className={styles.best}>Your best: {best}</p>}
          <p className={shared.muted}>Demo values only until the product team approves the real rules.</p>
          <button className={shared.goldBtn} onClick={start}><Play size={16} /> Start Dash</button>
        </div>
      )}

      {phase === 'play' && (
        <>
          <div className={styles.hud}>
            <span><Timer size={14} /> 00:{String(time).padStart(2, '0')}</span>
            <span>Score <b>{score}</b></span>
            <span className={styles.combo}>x{mult}</span>
            <span aria-label={`${lives} lives`}>{Array.from({ length: dashRules.lives }, (_, n) => <Heart key={n} size={14} fill={n < lives ? '#e8564a' : 'none'} color="#e8564a" />)}</span>
          </div>
          <div className={styles.stage} tabIndex={0} autoFocus onPointerDown={onTap} onKeyDown={onKey} aria-label="Game area. Use arrow keys to change lane.">
            <div className={styles.track}>
              {items.map((i) => (
                <div key={i.id} className={styles.item} style={{ left: `${i.lane * 33.33 + 16.66}%`, top: i.y + '%' }}>
                  {i.hazard ? <span className={styles.hazard}><X size={18} /></span> : <img src={i.good.img} alt="" />}
                </div>
              ))}
              <div className={styles.player} style={{ left: `${lane * 33.33 + 16.66}%` }} />
            </div>
          </div>
        </>
      )}

      {phase === 'result' && (
        <div className={`${styles.panel} ${styles.result}`}>
          <img src={trophy} alt="" className={styles.trophy} />
          <h4>Run Complete!</h4>
          <div className={styles.final}>{score}</div>
          {score >= best && score > 0 ? <span className={styles.badge}>New Best!</span> : <span className={shared.muted}>Best: {best}</span>}
          <div className={styles.rewards}>
            <div><b>+{reward.xp} XP</b><small>Experience</small></div>
            <div><b>+{reward.ves} VEs</b><small>Your Reward</small></div>
          </div>
          <p className={shared.muted}>Demo reward: only the XP is added locally on this page.</p>
          <button className={shared.goldBtn} onClick={start}><RotateCcw size={16} /> Play Again</button>
        </div>
      )}
    </section>
  )
}
