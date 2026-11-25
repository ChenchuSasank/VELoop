import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import { levelConfig } from '../../data/levels'
import LevelRunner from '../../components/LevelRunner/LevelRunner'
import styles from '../Pages.module.css'

export default function LevelPlay() {
  const n = Number(useParams().n)
  const navigate = useNavigate()
  const { unlocked } = useProgress()

  if (!Number.isInteger(n) || n < 1 || n > unlocked) return <Navigate to="/Lvl-Dashboard/levels" replace />

  return (
    <main className="container py-4" style={{ maxWidth: 560 }}>
      <h1 className={styles.head}>Level {n} · {levelConfig(n).name}</h1>
      <LevelRunner key={n} n={n} showTitle={false} onNext={() => navigate(`/Lvl-Dashboard/play/${n + 1}`)} />
    </main>
  )
}