import { useState, useEffect, useRef } from 'react'
import useLevelData from '../../hooks/useLevelData'
import { activity } from '../../data/levelData'
import { levelConfig, levelReward, nextMilestone, milestones } from '../../data/levels'
import LevelHero from '../../components/LevelHero/LevelHero'
import NextLevelReward from '../../components/NextLevelReward/NextLevelReward'
import LevelRoadmap from '../../components/LevelRoadmap/LevelRoadmap'
import LevelRunner from '../../components/LevelRunner/LevelRunner'
import EarnMoreXP from '../../components/EarnMoreXP/EarnMoreXP'
import XPActivity from '../../components/XPActivity/XPActivity'
import IntroSplash from '../../components/IntroSplash/IntroSplash'
import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import LevelUpModal from '../../components/LevelUpModal/LevelUpModal'
import styles from './LevelDashboard.module.css'

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'
}
const pad = (n) => String(n).padStart(2, '0')

export default function LevelDashboard() {
  const { status, data, reload } = useLevelData()
  const progress = useProgress()
  const [sessionXP, setSessionXP] = useState(0)
  const [log, setLog] = useState([])
  const [homeLevel, setHomeLevel] = useState(progress.unlocked)
  const [celebratedLevel, setCelebratedLevel] = useState(null)
  const baseLevel = useRef(null)
  const [intro, setIntro] = useState(() => !sessionStorage.getItem('introSeen'))
  useEffect(() => { const t = setTimeout(() => { sessionStorage.setItem('introSeen', '1'); setIntro(false) }, 2200); return () => clearTimeout(t) }, [])

  if (intro) return <IntroSplash />

  if (status === 'error') {
    return (
      <div className={styles.center}>
        <h2>Unable to load level progress</h2>
        <p>We couldn't load your level information right now.</p>
        <div><button className={styles.goldBtn} onClick={reload}>Try Again</button></div>
      </div>
    )
  }
  if (status === 'loading') {
    return (
      <div className="container py-4">
        <div className={styles.skeleton} style={{ height: 200 }} />
        <div className={styles.skeleton} style={{ height: 140 }} />
        <div className={styles.skeleton} style={{ height: 260 }} />
      </div>
    )
  }

  const level = progress.unlocked
  const completed = progress.completed
  const xp = data.xp + progress.xp
  const config = levelConfig(level)
  const milestone = nextMilestone(completed)
  const pct = milestone ? Math.min(100, Math.round((completed / milestone.level) * 100)) : 100

  const reward = milestone
    ? { title: `Level ${pad(milestone.level)} Reward`, text: milestone.text, hint: `Complete Level ${milestone.level} to unlock`, pct }
    : { title: `Level ${pad(level + 1)} Reward`, text: levelReward(level + 1), hint: `Reach Level ${level + 1} to unlock`, pct: 0 }

  const sub = `Win Level ${level} to earn +${20 + level * 2} XP and unlock Level ${level + 1}`
  const barText = milestone
    ? `${completed} of ${milestone.level} levels to your next reward (${pct}%)`
    : 'All milestone rewards reached'

  if (baseLevel.current === null) baseLevel.current = level
  const startLevel = celebratedLevel ?? baseLevel.current
  const showLevelUp = level > startLevel
  const won = milestones.find((m) => m.level === completed)
  const levelUpInfo = { level, name: config.name, reward: won ? won.text : `+${20 + completed * 2} XP` }

  const handleWin = ({ n, xp: gained }) => {
    setSessionXP((s) => s + gained)
    if (gained > 0) setLog((l) => [{ id: Date.now(), xp: `+${gained} XP`, title: `Level ${n} completed`, time: 'Just now' }, ...l])
  }

  return (
    <main className="container py-4 pb-5 mb-4">
      <h1 className={styles.title}>{getGreeting()}, {data.name}! 👋</h1>
      <p className={styles.sub}>Level up your journey and unlock epic rewards every day.</p>

      <Link to={`/Lvl-Dashboard/play/${level}${completed > 0 ? '?go=1' : ''}`} className="d-block mb-3 text-decoration-none">
        <div className={styles.goldBtn} style={{ textAlign: 'center' }}>{level === 1 && !progress.stars[1] ? 'Start Level 1' : `Continue Level ${level}`}</div>
      </Link>
      <div className="row g-3">
        <div className="col-12 col-lg-7"><LevelHero level={level} name={config.name} xp={xp} sub={sub} pct={pct} barText={barText} user={{ ...data, xpToday: data.xpToday + sessionXP }} /></div>
        <div className="col-12 col-lg-5"><NextLevelReward reward={reward} /></div>
        <div className="col-12"><LevelRoadmap currentLevel={level} /></div>
        <div className="col-12 col-lg-7"><LevelRunner n={homeLevel} onNext={() => setHomeLevel((l) => l + 1)} onWin={handleWin} /></div>
        <div className="col-12 col-lg-5"><XPActivity items={[...log, ...activity]} totalXP={data.xpToday + sessionXP} /></div>
        <div className="col-12"><EarnMoreXP /></div>
      </div>

      {showLevelUp && (
        <LevelUpModal level={levelUpInfo} onContinue={() => setCelebratedLevel(level)} />
      )}
    </main>
  )
}