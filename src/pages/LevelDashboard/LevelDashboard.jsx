import { useState, useEffect } from 'react'
import useLevelData from '../../hooks/useLevelData'
import { getLevel, getNextLevel, activity } from '../../data/levelData'
import LevelHero from '../../components/LevelHero/LevelHero'
import NextLevelReward from '../../components/NextLevelReward/NextLevelReward'
import LevelRoadmap from '../../components/LevelRoadmap/LevelRoadmap'
import GameHub from '../../components/GameHub/GameHub'
import EarnMoreXP from '../../components/EarnMoreXP/EarnMoreXP'
import XPActivity from '../../components/XPActivity/XPActivity'
import IntroSplash from '../../components/IntroSplash/IntroSplash'
import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import LevelUpModal from '../../components/LevelUpModal/LevelUpModal'
import styles from './LevelDashboard.module.css'

export default function LevelDashboard() {
  const { status, data, reload } = useLevelData()
  const [bonusXP, setBonusXP] = useState(0) // XP won in the game (local only)
  const [celebratedLevel, setCelebratedLevel] = useState(null)
  const progress = useProgress()
  const [intro, setIntro] = useState(() => !sessionStorage.getItem('introSeen')) // opening animation, once per visit
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

  const xp = data.xp + bonusXP + progress.xp
  const current = getLevel(xp)
  const next = getNextLevel(current.level)
  // Show the celebration only when the level went up after the page loaded
  const startLevel = celebratedLevel ?? getLevel(data.xp).level
  const showLevelUp = current.level > startLevel

  return (
    <main className="container py-4 pb-5 mb-4">
      <h1 className={styles.title}>Good Morning, {data.name}! 👋</h1>
      <p className={styles.sub}>Level up your journey and unlock epic rewards every day.</p>

      <Link to="/Lvl-Dashboard/levels" className="d-block mb-3 text-decoration-none">
        <div className={styles.goldBtn} style={{ textAlign: 'center' }}>Continue Level {progress.unlocked}</div>
      </Link>
      <div className="row g-3">
        <div className="col-12 col-lg-7"><LevelHero xp={xp} current={current} next={next} user={data} /></div>
        <div className="col-12 col-lg-5"><NextLevelReward xp={xp} next={next} /></div>
        <div className="col-12"><LevelRoadmap currentLevel={current.level} /></div>
        <div className="col-12 col-lg-7"><GameHub onReward={(gain) => setBonusXP((b) => b + gain)} /></div>
        <div className="col-12 col-lg-5"><XPActivity items={activity} /></div>
        <div className="col-12"><EarnMoreXP /></div>
      </div>

      {showLevelUp && (
        <LevelUpModal level={current} onContinue={() => setCelebratedLevel(current.level)} />
      )}
    </main>
  )
}
