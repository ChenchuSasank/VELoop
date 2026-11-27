import { useState, useEffect, useRef } from 'react'
import { Snowflake, Wrench, Zap, Layers, Flame } from 'lucide-react'
import coin from '../../assets/ve-coin.png'
import styles from './LevelGame.module.css'

const BLOCK_H = 30
const GROUND = 16
const START_W = 46

export default function LevelGame({ config, boostUnlocked, onFinish, fill = false }) {
  const [, setFrame] = useState(0)
  const stageRef = useRef(null)
  const [used, setUsed] = useState({ slow: false, repair: false, boost: false })
  const g = useRef({
    stack: [{ x: (100 - START_W) / 2, w: START_W }],
    cur: { x: 0, w: START_W, dir: 1 },
    floors: 0, perfects: 0, combo: 0, score: 0, ves: 0,
    slowLeft: 0, boostLeft: 0, cuts: [], pops: [], banner: '', bannerUntil: 0, now: 0, done: false,
  })

  const finish = (win) => {
    const s = g.current
    if (s.done) return
    s.done = true
    const ratio = s.perfects / Math.max(1, s.floors)
    onFinish({ win, score: s.score, ves: s.ves, stars: ratio >= 0.6 ? 3 : ratio >= 0.3 ? 2 : 1 })
  }

  function drop() {
    const s = g.current
    if (s.done) return
    const top = s.stack[s.stack.length - 1]
    const m = s.cur
    const left = Math.max(top.x, m.x)
    const right = Math.min(top.x + top.w, m.x + m.w)
    const overlap = right - left
    const level = s.stack.length

    if (overlap <= 0) {
      s.cuts.push({ id: Math.random(), x: m.x, w: m.w, level, t: s.now })
      finish(false)
      return
    }

    const perfect = Math.abs(m.x - top.x) < 1.2
    let next
    if (perfect) {
      s.combo += 1
      s.perfects += 1
      const w = Math.min(70, top.w + (s.combo >= 3 ? 1.5 : 0))
      next = { x: Math.max(0, top.x - (w - top.w) / 2), w }
    } else {
      s.combo = 0
      next = { x: left, w: overlap }
      s.cuts.push({ id: Math.random(), x: m.x < top.x ? m.x : right, w: m.w - overlap, level, t: s.now })
    }

    const points = (10 + (perfect ? 15 * Math.min(s.combo, 5) : 0)) * (s.boostLeft > 0 ? 2 : 1)
    s.score += points
    s.ves += perfect ? 2 : 1
    s.floors += 1
    s.pops.push({ id: Math.random(), text: perfect ? `PERFECT +${points}` : `+${points}`, x: next.x + next.w / 2, level, perfect, t: s.now })
    if (perfect && s.combo >= 2) { s.banner = `${s.combo} PERFECT STREAK`; s.bannerUntil = s.now + 1.2 }
    if (s.slowLeft > 0) s.slowLeft -= 1
    if (s.boostLeft > 0) s.boostLeft -= 1
    s.stack.push(next)

    const reached = config.goal.type === 'floors' ? s.floors >= config.goal.amount : s.perfects >= config.goal.amount
    if (reached) { finish(true); return }

    const fromLeft = s.floors % 2 === 0
    s.cur = { w: next.w, x: fromLeft ? 0 : 100 - next.w, dir: fromLeft ? 1 : -1 }
  }

  function usePower(name) {
    const s = g.current
    if (used[name] || s.done) return
    if (name === 'slow') s.slowLeft = 4
    if (name === 'boost') s.boostLeft = 5
    if (name === 'repair') {
      const top = s.stack[s.stack.length - 1]
      const add = Math.min(8, 70 - top.w)
      top.w += add
      top.x = Math.max(0, top.x - add / 2)
      s.cur.w = top.w
      s.cur.x = Math.min(s.cur.x, 100 - s.cur.w)
    }
    setUsed((u) => ({ ...u, [name]: true }))
  }

  useEffect(() => { stageRef.current?.focus({ preventScroll: true }) }, [])

  useEffect(() => {
    const loop = setInterval(() => {
      const s = g.current
      if (s.done) return
      s.now += 0.016
      const speed = Math.min(2.6, config.speed + s.floors * 0.02) * (s.slowLeft > 0 ? 0.5 : 1)
      s.cur.x += s.cur.dir * speed
      const max = 100 - s.cur.w
      if (s.cur.x >= max) { s.cur.x = max; s.cur.dir = -1 }
      if (s.cur.x <= 0) { s.cur.x = 0; s.cur.dir = 1 }
      s.cuts = s.cuts.filter((c) => s.now - c.t < 1)
      s.pops = s.pops.filter((p) => s.now - p.t < 0.9)
      setFrame((f) => f + 1)
    }, 16)
    return () => clearInterval(loop)
  }, [config])

  const s = g.current
  const stageH = stageRef.current ? stageRef.current.clientHeight : 440
  const visible = Math.max(6, Math.round(stageH / BLOCK_H / 2.3))
  const camera = Math.max(0, s.stack.length - visible) * BLOCK_H
  const hueOf = (level) => (config.hue + level * 7) % 360
  const goalNow = config.goal.type === 'floors' ? s.floors : s.perfects
  const bottomOf = (level) => GROUND + level * BLOCK_H

  return (
    <div className={`${styles.wrap} ${fill ? styles.fill : ''} ${styles['bg' + config.pattern]}`} style={{ '--h': config.hue }}>
      <div className={styles.hud}>
        <span><Layers size={14} /> {goalNow} / {config.goal.amount}</span>
        <span className={styles.score}>{s.score}</span>
        <span><Flame size={14} /> x{s.combo}</span>
        <span><img src={coin} alt="" width="16" /> +{s.ves}</span>
      </div>
      <div className={styles.goalBar}><i style={{ width: (goalNow / config.goal.amount) * 100 + '%' }} /></div>

      <div ref={stageRef} className={styles.stage} tabIndex={0} aria-label="Game area. Tap or press Space to drop the block."
        onPointerDown={drop}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); drop() } }}>
        <div className={styles.sky} />
        <div className={styles.orb} />
        <div className={styles.far} style={{ transform: `scaleX(-1) translateY(${camera * 0.15}px)` }} />
        <div className={styles.near} style={{ transform: `translateY(${camera * 0.3}px)` }} />

        <div className={styles.world} style={{ transform: `translateY(${camera}px)` }}>
          <div className={styles.ground} />
          {s.stack.map((b, i) => (
            <div key={i} className={styles.block} style={{ left: b.x + '%', width: b.w + '%', bottom: bottomOf(i), '--bh': hueOf(i) }} />
          ))}
          {!s.done && (
            <div className={`${styles.block} ${styles.moving}`} style={{ left: s.cur.x + '%', width: s.cur.w + '%', bottom: bottomOf(s.stack.length), '--bh': hueOf(s.stack.length) }} />
          )}
          {s.cuts.map((c) => (
            <div key={c.id} className={`${styles.block} ${styles.cut}`} style={{ left: c.x + '%', width: c.w + '%', bottom: bottomOf(c.level), '--bh': hueOf(c.level) }} />
          ))}
          {s.pops.map((p) => (
            <span key={p.id} className={`${styles.pop} ${p.perfect ? styles.perfect : ''}`} style={{ left: p.x + '%', bottom: bottomOf(p.level) + 36 }}>{p.text}</span>
          ))}
        </div>
        {s.now < s.bannerUntil && <div className={styles.banner}>{s.banner}</div>}
        <div className={styles.hint}>Tap or press Space to drop</div>
      </div>

      <div className={styles.powers}>
        <button disabled={used.slow} onClick={() => usePower('slow')}><Snowflake size={16} /> Slow</button>
        <button disabled={used.repair} onClick={() => usePower('repair')}><Wrench size={16} /> Repair</button>
        <button disabled={!boostUnlocked || used.boost} onClick={() => usePower('boost')}><Zap size={16} /> {boostUnlocked ? 'Boost x2' : 'Locked'}</button>
      </div>
    </div>
  )
}