import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Star, X } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { levelConfig, BOOST_UNLOCK } from '../../data/levels'
import LevelGame from '../LevelGame/LevelGame'
import shared from '../../styles/shared.module.css'
import pages from '../../pages/Pages.module.css'
import styles from './LevelRunner.module.css'

export default function LevelRunner({ n, onNext, onWin, showTitle = true }) {
  const { completed, complete, stars } = useProgress()
  const [phase, setPhase] = useState('intro')
  const [result, setResult] = useState(null)
  const [round, setRound] = useState(0)

  const config = levelConfig(n)
  const boostUnlocked = completed >= BOOST_UNLOCK

  const finish = (r) => {
    const first = !stars[n]
    if (r.win) {
      complete(n, r.stars, r.ves)
      if (onWin) onWin({ n, xp: first ? 20 + n * 2 : 0 })
    }
    setResult({ ...r, first })
    setPhase('result')
  }
  useEffect(() => {
    if (phase !== 'play') return
    const onKey = (e) => { if (e.key === 'Escape') setPhase('intro') }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [phase])

  const replay = () => { setRound((x) => x + 1); setPhase('play') }
  const next = () => { setPhase('intro'); setResult(null); onNext() }

  return (
    <section className={shared.card} aria-label="Play and earn">
      {showTitle && <h3 className={shared.cardTitle}>Play & Earn · Level {n} · {config.name}</h3>}

      {phase === 'intro' && (
        <div className={styles.panel}>
          <p><b>Goal:</b> {config.goal.label} ({config.goal.amount}).</p>
          <ul className={`${shared.muted} ${styles.rules}`}>
            <li>A block slides across the screen. Tap or press Space to drop it onto the tower.</li>
            <li>Only the part that overlaps stays. A perfect drop keeps the full width and builds a streak.</li>
            <li>If the block misses the tower completely, the run ends.</li>
            <li>Power-ups (once per level): Slow, Repair{boostUnlocked ? ', Boost x2' : ''}.</li>
            <li>Stars: more perfect drops = more stars. Win to unlock Level {n + 1}.</li>
            {n === BOOST_UNLOCK + 1 && <li><b>New power-up unlocked: Boost x2!</b></li>}
            {!boostUnlocked && <li>Complete {BOOST_UNLOCK} levels to reveal a new power-up.</li>}
          </ul>
          <p className={shared.muted}>Demo values. XP is given the first time you win a level.</p>
          <button className={shared.goldBtn} onClick={() => setPhase('play')}>Start Level</button>
        </div>
      )}

      {phase === 'play' && createPortal(
        <div className={styles.overlay} style={{ '--h': config.hue }}>
          <div className={styles.frame}>
            <div className={styles.bar}>
              <button className={styles.exit} onClick={() => setPhase('intro')}><X size={16} /> Exit</button>
              <b>Level {n} · {config.name}</b>
            </div>
            <div className={styles.game}>
              <LevelGame key={round} fill config={config} boostUnlocked={boostUnlocked} onFinish={finish} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {phase === 'result' && (
        <div className={`${styles.panel} ${styles.result}`}>
          <h2>{result.win ? 'Level Complete!' : 'Not this time'}</h2>
          {result.win && <div>{Array.from({ length: result.stars }, (_, s) => <Star key={s} size={32} fill="#ffe08a" color="#ffe08a" />)}</div>}
          <p>Score: <b>{result.score}</b></p>
          {result.win && (result.first
            ? <div className={pages.stats}><div className={pages.stat}><b>+{20 + n * 2}</b>XP</div><div className={pages.stat}><b>+{result.ves}</b>VEs</div></div>
            : <p className={shared.muted}>You already won this level, so rewards were given the first time only.</p>)}
          <p className={shared.muted}>{result.win ? `Level ${n + 1} is now unlocked.` : 'Try again. Aim for the middle of the tower and use your power-ups.'}</p>
          {result.win && <button className={shared.goldBtn} onClick={next}>Next Level</button>}
          <button className={result.win ? shared.ghostBtn : shared.goldBtn} onClick={replay}>{result.win ? 'Replay' : 'Try Again'}</button>
          <Link to="/Lvl-Dashboard/levels" className={`${shared.ghostBtn} ${pages.cta}`}>View Level Map</Link>
        </div>
      )}
    </section>
  )
}