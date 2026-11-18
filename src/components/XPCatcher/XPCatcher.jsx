import { useState, useEffect, useRef } from 'react'
import { Info, Timer, Play, RotateCcw } from 'lucide-react'
import orb from '../../assets/xp-orb.png'
import coin from '../../assets/ve-coin.png'
import gem from '../../assets/gem-green.png'
import trophy from '../../assets/trophy-star.png'
import { gameRules } from '../../data/levelData'
import shared from '../../styles/shared.module.css'
import styles from './Game.module.css'

// Item types: points are DEMO values (see gameRules in data/levelData.js)
const TYPES = [
  { key: 'xp', img: orb, points: 10 },
  { key: 'coin', img: coin, points: 5 },
  { key: 'gem', img: gem, points: 15 },
]

export default function XPCatcher({ onReward }) {
  const [phase, setPhase] = useState('start') // start | play | result
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [time, setTime] = useState(gameRules.seconds)
  const [items, setItems] = useState([])
  const [basketX, setBasketX] = useState(50)
  const [reward, setReward] = useState({ xp: 0, ves: 0 })

  const itemsRef = useRef([])
  const scoreRef = useRef(0)
  const basketRef = useRef(50)
  const areaRef = useRef(null)

  const moveBasket = (x) => { basketRef.current = Math.max(8, Math.min(92, x)); setBasketX(basketRef.current) }

  function startGame() {
    itemsRef.current = []; scoreRef.current = 0
    setItems([]); setScore(0); setTime(gameRules.seconds); setPhase('play')
    areaRef.current?.focus()
  }

  function finishGame() {
    const finalScore = scoreRef.current
    const xp = Math.min(30, Math.floor(finalScore / 4))
    const ves = finalScore >= 80 ? 12 : 0
    setReward({ xp, ves })
    setBest((b) => Math.max(b, finalScore))
    setPhase('result')
    onReward(xp) // local state only - a real backend call would go here
  }

  // Game loop: move items, spawn new ones, check catches
  useEffect(() => {
    if (phase !== 'play') return
    let tick = 0
    const loop = setInterval(() => {
      tick++
      let next = itemsRef.current.map((i) => ({ ...i, y: i.y + 2.2 }))
      if (tick % 12 === 0) {
        const type = TYPES[Math.floor(Math.random() * TYPES.length)]
        next.push({ id: Date.now() + Math.random(), x: 8 + Math.random() * 84, y: 0, type })
      }
      next = next.filter((i) => {
        const caught = i.y > 78 && i.y < 95 && Math.abs(i.x - basketRef.current) < 11
        if (caught) scoreRef.current += i.type.points
        return !caught && i.y < 100
      })
      itemsRef.current = next
      setItems(next)
      setScore(scoreRef.current)
    }, 50)
    return () => clearInterval(loop)
  }, [phase])

  // Countdown timer
  useEffect(() => {
    if (phase !== 'play') return
    if (time <= 0) { finishGame(); return }
    const t = setTimeout(() => setTime((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, time]) // eslint-disable-line

  const onPointerMove = (e) => {
    const rect = areaRef.current.getBoundingClientRect()
    moveBasket(((e.clientX - rect.left) / rect.width) * 100)
  }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') moveBasket(basketRef.current - 8)
    if (e.key === 'ArrowRight') moveBasket(basketRef.current + 8)
  }

  return (
    <section className={shared.card} aria-label="Play and earn">
      <h3 className={shared.cardTitle}>XP Catcher <span title="A skill game. Catch as many orbs, coins and gems as you can. Rewards shown are demo values."><Info size={14} /></span></h3>

      {phase === 'start' && (
        <div className={styles.panel}>
          <p>Move the basket to catch falling items. Score high for better rewards!</p>
          <ul className={styles.rules}>
            <li><b>Objective:</b> catch as many items as you can.</li>
            <li><b>Time:</b> {gameRules.seconds} seconds per round.</li>
            <li><b>Controls:</b> move your mouse or finger, or use the arrow keys.</li>
            <li><b>Scoring:</b> {gameRules.scoring}</li>
            <li><b>Reward:</b> {gameRules.reward}</li>
            <li><b>How often:</b> {gameRules.plays}</li>
          </ul>
          <p className={shared.muted}>Demo values only until the product team approves the real rules.</p>
          <button className={shared.goldBtn} onClick={startGame}><Play size={16} /> Start Game</button>
        </div>
      )}

      {phase === 'play' && (
        <>
          <div className={styles.hud}>
            <span><Timer size={14} /> 00:{String(time).padStart(2, '0')}</span>
            <span>Score: <b>{score}</b></span>
          </div>
          <div className={styles.timeBar}><div style={{ width: (time / gameRules.seconds) * 100 + '%' }} /></div>
          <div ref={areaRef} className={styles.area} tabIndex={0} onPointerMove={onPointerMove} onKeyDown={onKeyDown} aria-label="Game area. Use arrow keys to move the basket.">
            {items.map((i) => (
              <span key={i.id} className={`${styles.item} ${styles[i.type.key]}`} style={{ left: i.x + '%', top: i.y + '%' }}><img src={i.type.img} alt="" /></span>
            ))}
            <div className={styles.basket} style={{ left: basketX + '%' }} />
          </div>
        </>
      )}

      {phase === 'result' && (
        <div className={`${styles.panel} ${styles.result}`}>
          <img src={trophy} alt="" className={styles.trophy} />
          <h4>Challenge Complete!</h4>
          <div className={styles.final}>{score}</div>
          {score >= best && score > 0 && <span className={styles.newBest}>New Best!</span>}
          <div className={styles.rewards}>
            <div><b>+{reward.xp} XP</b><small>Experience</small></div>
            <div><b>+{reward.ves} VEs</b><small>Your Reward</small></div>
          </div>
          <p className={shared.muted}>Demo reward: only the XP is added locally on this page.</p>
          <button className={shared.goldBtn} onClick={startGame}><RotateCcw size={16} /> Play Again</button>
        </div>
      )}
    </section>
  )
}
