import { useProgress } from '../../hooks/useProgress'
import shared from '../../styles/shared.module.css'
import styles from '../Pages.module.css'

const players = [['Aarav', 42], ['Meera', 35], ['Kabir', 28], ['Isha', 21], ['Rohan', 14], ['Diya', 9], ['Neel', 4]]

export default function Ranks() {
  const { completed } = useProgress()
  const list = [...players, ['You', completed]].sort((a, b) => b[1] - a[1])
  return (
    <main className="container py-4" style={{ maxWidth: 640 }}>
      <h1 className={styles.head}>Leaderboard</h1>
      <p className={shared.muted}>Ranked by levels completed. Demo players until the backend is ready.</p>
      {list.map(([name, lv], i) => (
        <div key={name} className={`${styles.row} ${name === 'You' ? styles.you : ''}`}>
          <span><b>#{i + 1}</b> &nbsp;{name}</span><span>{lv} levels</span>
        </div>
      ))}
    </main>
  )
}