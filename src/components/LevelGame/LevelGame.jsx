import { useState, useEffect, useRef } from 'react'
import { Heart, Timer, Shield, Snowflake, Zap, X } from 'lucide-react'
import orb from '../../assets/xp-orb.png'
import coin from '../../assets/ve-coin.png'
import gem from '../../assets/gem-green.png'
import styles from './LevelGame.module.css'

const GOOD = [
  { kind: 'coin', img: coin, points: 10 }, { kind: 'coin', img: coin, points: 10 },
  { kind: 'orb', img: orb, points: 20 }, { kind: 'gem', img: gem, points: 30 }, { kind: 'coin', img: coin, points: 10 },
]

// One level of the game. The look and difficulty come from `config` (see data/levels.js).
export default function LevelGame({ config, boostUnlocked, onFinish }) {
  const [view, setView] = useState({ items: [], score: 0, lives: config.lives, combo: 0, coins: 0, gems: 0, time: config.seconds, lane: 1, shield: false, slow: false, boost: false })
  const [used, setUsed] = useState({ shield: false, slow: false, boost: false })
  const g = useRef({ items: [], score: 0, lives: config.lives, combo: 0, coins: 0, gems: 0, lane: 1, elapsed: 0, shield: false, slowUntil: 0, boostUntil: 0, done: false })

  const finish = (win) => {
    const s = g.current
    if (s.done) return
    s.done = true
    onFinish({ win, score: s.score, stars: s.lives >= 3 ? 3 : s.lives === 2 ? 2 : 1 })
  }
  const goalMet = (s) => (config.goal.type === 'score' ? s.score : config.goal.type === 'coins' ? s.coins : s.gems) >= config.goal.amount
  const move = (d) => { g.current.lane = Math.max(0, Math.min(2, g.current.lane + d)) }

  function usePower(name) {
    const s = g.current
    if (used[name] || s.done) return
    if (name === 'shield') s.shield = true
    if (name === 'slow') s.slowUntil = s.elapsed + 5
    if (name === 'boost') s.boostUntil = s.elapsed + 6
    setUsed((u) => ({ ...u, [name]: true }))
  }

  useEffect(() => {
    let tick = 0
    const loop = setInterval(() => {
      const s = g.current
      tick++; s.elapsed += 0.04
      const slow = s.elapsed < s.slowUntil, boost = s.elapsed < s.boostUntil
      const speed = (config.speed + s.elapsed * 0.04) * (slow ? 0.5 : 1)
      let next = s.items.map((i) => ({ ...i, y: i.y + speed }))
      if (tick % config.gap === 0) {
        next.push({ id: Math.random(), lane: Math.floor(Math.random() * 3), y: -8, hazard: Math.random() < config.hazard, good: GOOD[Math.floor(Math.random() * GOOD.length)] })
      }
      next = next.filter((i) => {
        if (i.lane !== s.lane || i.y < 72 || i.y > 90) return i.y < 100
        if (i.hazard) { if (s.shield) s.shield = false; else { s.lives -= 1; s.combo = 0 } }
        else {
          s.combo += 1
          s.score += i.good.points * Math.min(5, 1 + Math.floor(s.combo / 5)) * (boost ? 2 : 1)
          if (i.good.kind === 'coin') s.coins += 1
          if (i.good.kind === 'gem') s.gems += 1
        }
        return false
      })
      s.items = next
      setView((v) => ({ ...v, items: next, score: s.score, lives: s.lives, combo: s.combo, coins: s.coins, gems: s.gems, lane: s.lane, shield: s.shield, slow, boost }))
      if (goalMet(s)) { clearInterval(loop); finish(true) }
      else if (s.lives <= 0) { clearInterval(loop); finish(false) }
    }, 40)
    return () => clearInterval(loop)
  }, []) // eslint-disable-line

  useEffect(() => {
    if (view.time <= 0) { finish(goalMet(g.current)); return }
    const t = setTimeout(() => setView((v) => ({ ...v, time: v.time - 1 })), 1000)
    return () => clearTimeout(t)
  }, [view.time]) // eslint-disable-line

  const progress = Math.min(config.goal.amount, config.goal.type === 'score' ? view.score : config.goal.type === 'coins' ? view.coins : view.gems)
  const mult = Math.min(5, 1 + Math.floor(view.combo / 5))

  return (
    <div className={`${styles.wrap} ${styles['p' + config.pattern]}`} style={{ '--h': config.hue }}>
      <div className={styles.hud}>
        <span><Timer size={14} /> 00:{String(view.time).padStart(2, '0')}</span>
        <span className={styles.goal}>{progress} / {config.goal.amount}</span>
        <span className={styles.combo}>x{mult}</span>
        <span>{Array.from({ length: config.lives }, (_, n) => <Heart key={n} size={14} fill={n < view.lives ? '#e8564a' : 'none'} color="#e8564a" />)}</span>
      </div>
      <div className={styles.stage} tabIndex={0} autoFocus aria-label="Game area. Arrow keys change lane."
        onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); move(e.clientX - r.left < r.width / 2 ? -1 : 1) }}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft' || e.key === 'a') move(-1); if (e.key === 'ArrowRight' || e.key === 'd') move(1) }}>
        <div className={styles.track}>
          {view.items.map((i) => (
            <div key={i.id} className={styles.item} style={{ left: `${i.lane * 33.33 + 16.66}%`, top: i.y + '%' }}>
              {i.hazard ? <span className={styles.hazard}><X size={18} /></span> : <img src={i.good.img} alt="" />}
            </div>
          ))}
          <div className={`${styles.player} ${view.shield ? styles.shielded : ''}`} style={{ left: `${view.lane * 33.33 + 16.66}%` }} />
        </div>
      </div>
      <div className={styles.powers}>
        <button disabled={used.shield} onClick={() => usePower('shield')}><Shield size={16} /> Shield</button>
        <button disabled={used.slow} onClick={() => usePower('slow')}><Snowflake size={16} /> Slow</button>
        <button disabled={!boostUnlocked || used.boost} onClick={() => usePower('boost')}><Zap size={16} /> {boostUnlocked ? 'Boost x2' : 'Locked'}</button>
      </div>
    </div>
  )
}
