import { useState } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { levelConfig, BOOST_UNLOCK } from '../../data/levels'
import LevelGame from '../../components/LevelGame/LevelGame'
import shared from '../../styles/shared.module.css'
import styles from '../Pages.module.css'

export default function LevelPlay() {
  const n = Number(useParams().n)
  const navigate = useNavigate()
  const { unlocked, completed, complete } = useProgress()
  const [phase, setPhase] = useState('intro')
  const [result, setResult] = useState(null)
  const [round, setRound] = useState(0)

  if (!Number.isInteger(n) || n < 1 || n > unlocked) return <Navigate to="/Lvl-Dashboard/levels" replace />

  const config = levelConfig(n)
  const boostUnlocked = completed >= BOOST_UNLOCK
  const finish = (r) => { if (r.win) complete(n, r.stars); setResult(r); setPhase('result') }
  const replay = () => { setRound((x) => x + 1); setPhase('play') }
  const next = () => { setPhase('intro'); setResult(null); navigate(`/Lvl-Dashboard/play/${n + 1}`) }

  return (
    <main className="container py-4" style={{ maxWidth: 560 }}>
      <h1 className={styles.head}>Level {n} · {config.name}</h1>
      <div className={shared.card}>
        {phase === 'intro' && (
          <div style={{ display: 'grid', gap: '.7rem' }}>
            <p><b>Goal:</b> {config.goal.label} ({config.goal.amount}).</p>
            <ul className={shared.muted} style={{ paddingLeft: '1.1rem', margin: 0 }}>
              <li>{config.seconds} seconds and {config.lives} lives.</li>
              <li>Tap left/right (or arrow keys) to change lane. Collect items, dodge dark blocks.</li>
              <li>Power-ups (once per level): Shield blocks one hit, Slow slows items for 5s{boostUnlocked ? ', Boost doubles points for 6s' : ''}.</li>
              <li>Stars: 3 lives left = 3 stars. Win to unlock Level {n + 1}.</li>
              {n === BOOST_UNLOCK + 1 && <li><b>New power-up unlocked: Boost x2!</b></li>}
              {!boostUnlocked && <li>Complete {BOOST_UNLOCK} levels to reveal a new power-up.</li>}
            </ul>
            <p className={shared.muted}>Demo values. XP is given the first time you win a level.</p>
            <button className={shared.goldBtn} onClick={() => setPhase('play')}>Start Level</button>
          </div>
        )}
        {phase === 'play' && <LevelGame key={round} config={config} boostUnlocked={boostUnlocked} onFinish={finish} />}
        {phase === 'result' && (
          <div style={{ display: 'grid', gap: '.7rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--gold)', margin: 0 }}>{result.win ? 'Level Complete!' : 'Not this time'}</h2>
            {result.win && <div>{Array.from({ length: result.stars }, (_, s) => <Star key={s} size={32} fill="#ffe08a" color="#ffe08a" />)}</div>}
            <p>Score: <b>{result.score}</b></p>
            <p className={shared.muted}>{result.win ? `Level ${n + 1} is now unlocked.` : 'Try again. Change lanes early and use your power-ups.'}</p>
            {result.win && <button className={shared.goldBtn} onClick={next}>Next Level</button>}
            <button className={result.win ? shared.ghostBtn : shared.goldBtn} onClick={replay}>{result.win ? 'Replay' : 'Try Again'}</button>
            <Link to="/Lvl-Dashboard/levels" className={`${shared.ghostBtn} ${styles.cta}`}>Back to Map</Link>
          </div>
        )}
      </div>
    </main>
  )
}
