import { useState, useEffect } from 'react'
import useLevelData from '../../hooks/useLevelData'
import { activity } from '../../data/levelData'
import { levelConfig, nextMilestone } from '../../data/levels'
import LevelHero from '../../components/LevelHero/LevelHero'
import NextLevelReward from '../../components/NextLevelReward/NextLevelReward'
import LevelRoadmap from '../../components/LevelRoadmap/LevelRoadmap'
import VEDash from '../../components/VEDash/VEDash'
import EarnMoreXP from '../../components/EarnMoreXP/EarnMoreXP'
import XPActivity from '../../components/XPActivity/XPActivity'
import IntroSplash from '../../components/IntroSplash/IntroSplash'
import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import styles from './LevelDashboard.module.css'

export default function LevelDashboard() {
  const { status, data, reload } = useLevelData()
  const progress = useProgress()
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

  const xp = data.xp + progress.xp + progress.bonus
  const level = progress.unlocked
  const completed = progress.completed
  const next = nextMilestone(completed)

  return (
    <main className="container py-4 pb-5 mb-4">
      <h1 className={styles.title}>Good Morning, {data.name}! 👋</h1>
      <p className={styles.sub}>Level up your journey and unlock epic rewards every day.</p>

      <Link to="/Lvl-Dashboard/levels" className="d-block mb-3 text-decoration-none">
        <div className={styles.goldBtn} style={{ textAlign: 'center' }}>{completed === 0 ? 'Start Level 1' : `Continue Level ${level}`}</div>
      </Link>
      <div className="row g-3">
        <div className="col-12 col-lg-7"><LevelHero xp={xp} level={level} name={levelConfig(level).name} completed={completed} next={next} user={data} /></div>
        <div className="col-12 col-lg-5"><NextLevelReward completed={completed} next={next} /></div>
        <div className="col-12"><LevelRoadmap currentLevel={level} /></div>
        <div className="col-12 col-lg-7"><VEDash onReward={progress.addBonus} /></div>
        <div className="col-12 col-lg-5"><XPActivity items={activity} xpToday={data.xpToday} /></div>
        <div className="col-12"><EarnMoreXP /></div>
      </div>
    </main>
  )
}